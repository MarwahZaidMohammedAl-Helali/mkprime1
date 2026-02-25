<?php
/**
 * PHPMailer SMTP class.
 * Simplified SMTP implementation for Gmail.
 */

namespace PHPMailer\PHPMailer;

class SMTP
{
    protected $smtp_conn;
    protected $error = [];
    
    public function connect($host, $port = 587, $timeout = 300)
    {
        $errno = 0;
        $errstr = '';
        
        $this->smtp_conn = @fsockopen($host, $port, $errno, $errstr, $timeout);
        
        if (!$this->smtp_conn) {
            $this->error[] = "Failed to connect to server: $errstr ($errno)";
            return false;
        }
        
        // Read greeting
        $this->getResponse();
        
        // Send EHLO
        $this->sendCommand('EHLO', 'localhost');
        
        // Start TLS if port 587
        if ($port == 587) {
            $this->sendCommand('STARTTLS', '');
            stream_socket_enable_crypto($this->smtp_conn, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            $this->sendCommand('EHLO', 'localhost');
        }
        
        return true;
    }
    
    public function authenticate($username, $password)
    {
        $this->sendCommand('AUTH LOGIN', '');
        $this->sendCommand(base64_encode($username), '');
        $this->sendCommand(base64_encode($password), '');
        
        return true;
    }
    
    public function mail($from)
    {
        return $this->sendCommand('MAIL FROM', '<' . $from . '>');
    }
    
    public function recipient($to)
    {
        return $this->sendCommand('RCPT TO', '<' . $to . '>');
    }
    
    public function data($data)
    {
        $this->sendCommand('DATA', '');
        $this->sendCommand($data . "\r\n.", '');
        return true;
    }
    
    public function quit()
    {
        $this->sendCommand('QUIT', '');
        fclose($this->smtp_conn);
    }
    
    protected function sendCommand($command, $data = '')
    {
        if (!empty($data)) {
            $command .= ' ' . $data;
        }
        
        fputs($this->smtp_conn, $command . "\r\n");
        return $this->getResponse();
    }
    
    protected function getResponse()
    {
        $data = '';
        while ($str = fgets($this->smtp_conn, 515)) {
            $data .= $str;
            if (substr($str, 3, 1) == ' ') {
                break;
            }
        }
        return $data;
    }
}
