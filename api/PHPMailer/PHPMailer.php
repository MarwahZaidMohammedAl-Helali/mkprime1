<?php
/**
 * PHPMailer - PHP email creation and transport class.
 * Simplified version for GoDaddy hosting with Gmail SMTP support.
 * 
 * Based on PHPMailer by Marcus Bointon
 * @see https://github.com/PHPMailer/PHPMailer/
 */

namespace PHPMailer\PHPMailer;

class PHPMailer
{
    const CHARSET_UTF8 = 'utf-8';
    const ENCODING_BASE64 = 'base64';
    
    public $From = '';
    public $FromName = '';
    public $Subject = '';
    public $Body = '';
    public $AltBody = '';
    public $CharSet = self::CHARSET_UTF8;
    public $Encoding = self::ENCODING_BASE64;
    public $Mailer = 'smtp';
    public $Host = '';
    public $Port = 587;
    public $SMTPAuth = true;
    public $Username = '';
    public $Password = '';
    public $SMTPSecure = 'tls';
    public $Timeout = 300;
    public $SMTPDebug = 0;
    public $ErrorInfo = '';
    
    protected $to = [];
    protected $cc = [];
    protected $bcc = [];
    protected $ReplyTo = [];
    protected $attachment = [];
    protected $CustomHeader = [];
    
    public function __construct($exceptions = null)
    {
        // Constructor
    }
    
    public function isSMTP()
    {
        $this->Mailer = 'smtp';
    }
    
    public function isHTML($isHtml = true)
    {
        if ($isHtml) {
            $this->ContentType = 'text/html';
        } else {
            $this->ContentType = 'text/plain';
        }
    }
    
    public function addAddress($address, $name = '')
    {
        $this->to[] = ['address' => $address, 'name' => $name];
        return true;
    }
    
    public function addReplyTo($address, $name = '')
    {
        $this->ReplyTo[] = ['address' => $address, 'name' => $name];
        return true;
    }
    
    public function addAttachment($path, $name = '', $encoding = self::ENCODING_BASE64, $type = '', $disposition = 'attachment')
    {
        if (!file_exists($path) || !is_readable($path)) {
            $this->ErrorInfo = 'Could not access file: ' . $path;
            return false;
        }
        
        $this->attachment[] = [
            'path' => $path,
            'name' => $name ?: basename($path),
            'encoding' => $encoding,
            'type' => $type,
            'disposition' => $disposition
        ];
        return true;
    }
    
    public function addStringAttachment($string, $filename, $encoding = self::ENCODING_BASE64, $type = '', $disposition = 'attachment')
    {
        $this->attachment[] = [
            'string' => $string,
            'name' => $filename,
            'encoding' => $encoding,
            'type' => $type,
            'disposition' => $disposition
        ];
        return true;
    }
    
    public function clearAddresses()
    {
        $this->to = [];
    }
    
    public function clearAttachments()
    {
        $this->attachment = [];
    }
    
    public function send()
    {
        try {
            if (empty($this->to)) {
                throw new Exception('You must provide at least one recipient email address.');
            }
            
            if (empty($this->From)) {
                throw new Exception('From address is required.');
            }
            
            // Use SMTP
            return $this->smtpSend();
            
        } catch (Exception $exc) {
            $this->ErrorInfo = $exc->getMessage();
            return false;
        }
    }
    
    protected function smtpSend()
    {
        // Connect to SMTP server
        $smtp = new SMTP();
        
        if (!$smtp->connect($this->Host, $this->Port, $this->Timeout)) {
            $this->ErrorInfo = 'SMTP connect() failed.';
            return false;
        }
        
        // Authenticate
        if ($this->SMTPAuth) {
            if (!$smtp->authenticate($this->Username, $this->Password)) {
                $this->ErrorInfo = 'SMTP authentication failed.';
                return false;
            }
        }
        
        // Send MAIL FROM
        if (!$smtp->mail($this->From)) {
            $this->ErrorInfo = 'SMTP MAIL FROM failed.';
            return false;
        }
        
        // Send RCPT TO
        foreach ($this->to as $toaddr) {
            if (!$smtp->recipient($toaddr['address'])) {
                $this->ErrorInfo = 'SMTP RCPT TO failed.';
                return false;
            }
        }
        
        // Send DATA
        if (!$smtp->data($this->createHeader() . $this->createBody())) {
            $this->ErrorInfo = 'SMTP DATA failed.';
            return false;
        }
        
        $smtp->quit();
        return true;
    }
    
    protected function createHeader()
    {
        $result = '';
        
        // From
        $result .= 'From: ' . $this->encodeHeader($this->FromName) . ' <' . $this->From . '>' . "\r\n";
        
        // To
        foreach ($this->to as $toaddr) {
            $result .= 'To: ' . $this->encodeHeader($toaddr['name']) . ' <' . $toaddr['address'] . '>' . "\r\n";
        }
        
        // Reply-To
        foreach ($this->ReplyTo as $reply) {
            $result .= 'Reply-To: ' . $this->encodeHeader($reply['name']) . ' <' . $reply['address'] . '>' . "\r\n";
        }
        
        // Subject
        $result .= 'Subject: ' . $this->encodeHeader($this->Subject) . "\r\n";
        
        // Date
        $result .= 'Date: ' . date('r') . "\r\n";
        
        // MIME Version
        $result .= 'MIME-Version: 1.0' . "\r\n";
        
        // Content-Type
        if (!empty($this->attachment)) {
            $boundary = '----=_Part_' . md5(uniqid(time()));
            $result .= 'Content-Type: multipart/mixed; boundary="' . $boundary . '"' . "\r\n";
            $result .= "\r\n";
            $result .= '--' . $boundary . "\r\n";
            $result .= 'Content-Type: text/html; charset=' . $this->CharSet . "\r\n";
            $result .= 'Content-Transfer-Encoding: quoted-printable' . "\r\n";
            $result .= "\r\n";
            $this->boundary = $boundary;
        } else {
            $result .= 'Content-Type: text/html; charset=' . $this->CharSet . "\r\n";
            $result .= 'Content-Transfer-Encoding: quoted-printable' . "\r\n";
        }
        
        $result .= "\r\n";
        
        return $result;
    }
    
    protected function createBody()
    {
        $body = quoted_printable_encode($this->Body);
        
        // Add attachments
        if (!empty($this->attachment)) {
            foreach ($this->attachment as $attachment) {
                $body .= "\r\n--" . $this->boundary . "\r\n";
                
                if (isset($attachment['string'])) {
                    $data = $attachment['string'];
                } else {
                    $data = file_get_contents($attachment['path']);
                }
                
                $body .= 'Content-Type: application/octet-stream; name="' . $attachment['name'] . '"' . "\r\n";
                $body .= 'Content-Transfer-Encoding: base64' . "\r\n";
                $body .= 'Content-Disposition: attachment; filename="' . $attachment['name'] . '"' . "\r\n";
                $body .= "\r\n";
                $body .= chunk_split(base64_encode($data)) . "\r\n";
            }
            $body .= "\r\n--" . $this->boundary . "--\r\n";
        }
        
        return $body;
    }
    
    protected function encodeHeader($str)
    {
        if (empty($str)) {
            return '';
        }
        return '=?' . $this->CharSet . '?B?' . base64_encode($str) . '?=';
    }
}
