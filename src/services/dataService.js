import { supabase } from '../supabaseClient'

// Careers
export const getCareers = async () => {
  const { data, error } = await supabase
    .from('careers')
    .select('*')
    .order('id', { ascending: true })
  
  if (error) {
    console.error('Error fetching careers:', error)
    return []
  }
  
  return data.map(career => ({
    id: career.id,
    titleEn: career.title_en,
    titleAr: career.title_ar,
    type: career.type_en,
    typeAr: career.type_ar,
    descEn: career.description_en,
    descAr: career.description_ar
  }))
}

export const addCareer = async (career) => {
  const { data, error } = await supabase
    .from('careers')
    .insert([{
      title_en: career.titleEn,
      title_ar: career.titleAr,
      type_en: career.type,
      type_ar: career.typeAr,
      description_en: career.descEn,
      description_ar: career.descAr
    }])
    .select()
  
  if (error) {
    console.error('Error adding career:', error)
    throw error
  }
  
  return data[0]
}

export const updateCareer = async (id, updates) => {
  console.log('updateCareer called with:', { id, updates });
  
  const dbUpdates = {}
  if (updates.titleEn !== undefined) dbUpdates.title_en = updates.titleEn
  if (updates.titleAr !== undefined) dbUpdates.title_ar = updates.titleAr
  if (updates.type !== undefined) dbUpdates.type_en = updates.type
  if (updates.typeAr !== undefined) dbUpdates.type_ar = updates.typeAr
  if (updates.descEn !== undefined) dbUpdates.description_en = updates.descEn
  if (updates.descAr !== undefined) dbUpdates.description_ar = updates.descAr
  
  console.log('Sending to Supabase:', { id, dbUpdates });
  
  const { data, error } = await supabase
    .from('careers')
    .update(dbUpdates)
    .eq('id', id)
    .select()
  
  console.log('Supabase response:', { data, error });
  
  if (error) {
    console.error('Supabase error details:', error);
    throw error
  }
  
  if (!data || data.length === 0) {
    console.warn('No data returned from update - this might indicate RLS blocking the operation');
    // Don't throw error, just log warning
  }
  
  return data?.[0]
}

export const deleteCareer = async (id) => {
  const { error } = await supabase
    .from('careers')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting career:', error)
    throw error
  }
}

// Services
export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching services:', error)
    return []
  }
  
  return data.map(service => ({
    id: service.id,
    titleEn: service.title_en,
    titleAr: service.title_ar,
    descEn: service.description_en,
    descAr: service.description_ar,
    imageUrl: service.image_url
  }))
}

export const addService = async (service) => {
  const { data, error } = await supabase
    .from('services')
    .insert([{
      title_en: service.titleEn,
      title_ar: service.titleAr,
      description_en: service.descEn,
      description_ar: service.descAr,
      image_url: service.imageUrl,
      display_order: service.displayOrder || 1
    }])
    .select()
  
  if (error) {
    console.error('Error adding service:', error)
    throw error
  }
  
  return data[0]
}

export const updateService = async (id, updates) => {
  const dbUpdates = {}
  if (updates.titleEn !== undefined) dbUpdates.title_en = updates.titleEn
  if (updates.titleAr !== undefined) dbUpdates.title_ar = updates.titleAr
  if (updates.descEn !== undefined) dbUpdates.description_en = updates.descEn
  if (updates.descAr !== undefined) dbUpdates.description_ar = updates.descAr
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl
  
  const { data, error } = await supabase
    .from('services')
    .update(dbUpdates)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating service:', error)
    throw error
  }
  
  return data[0]
}

export const deleteService = async (id) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting service:', error)
    throw error
  }
}

// Partners
export const getPartners = async () => {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching partners:', error)
    return []
  }
  
  return data.map(partner => ({
    id: partner.id,
    nameEn: partner.name_en,
    nameAr: partner.name_ar,
    logoPath: partner.logo_path,
    order: partner.display_order
  }))
}

export const addPartner = async (partner) => {
  const { data, error } = await supabase
    .from('partners')
    .insert([{
      name_en: partner.nameEn,
      name_ar: partner.nameAr,
      logo_path: partner.logoPath,
      display_order: partner.order || 1
    }])
    .select()
  
  if (error) {
    console.error('Error adding partner:', error)
    throw error
  }
  
  return data[0]
}

export const updatePartner = async (id, updates) => {
  const dbUpdates = {}
  if (updates.nameEn !== undefined) dbUpdates.name_en = updates.nameEn
  if (updates.nameAr !== undefined) dbUpdates.name_ar = updates.nameAr
  if (updates.logoPath !== undefined) dbUpdates.logo_path = updates.logoPath
  if (updates.order !== undefined) dbUpdates.display_order = updates.order
  
  const { data, error } = await supabase
    .from('partners')
    .update(dbUpdates)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating partner:', error)
    throw error
  }
  
  return data[0]
}

export const deletePartner = async (id) => {
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting partner:', error)
    throw error
  }
}

// About Info
export const getAboutInfo = async () => {
  const { data, error } = await supabase
    .from('about_info')
    .select('*')
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error fetching about info:', error)
    return {}
  }
  
  return {
    descEn: data.description_en,
    descAr: data.description_ar,
    founded: data.founded_year,
    team: data.team_size,
    type: data.company_type_en,
    typeAr: data.company_type_ar
  }
}

export const updateAboutInfo = async (aboutInfo) => {
  const { data, error } = await supabase
    .from('about_info')
    .upsert([{
      id: 1,
      description_en: aboutInfo.descEn,
      description_ar: aboutInfo.descAr,
      founded_year: aboutInfo.founded,
      team_size: aboutInfo.team,
      company_type_en: aboutInfo.type,
      company_type_ar: aboutInfo.typeAr
    }])
    .select()
  
  if (error) {
    console.error('Error updating about info:', error)
    throw error
  }
  
  return data[0]
}

// Hero Content
export const getHeroContent = async () => {
  const { data, error } = await supabase
    .from('hero_content')
    .select('*')
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error fetching hero content:', error)
    return {}
  }
  
  return {
    titleEn: data.title_en,
    titleAr: data.title_ar,
    subtitleEn: data.subtitle_en,
    subtitleAr: data.subtitle_ar
  }
}

export const updateHeroContent = async (heroContent) => {
  const { data, error } = await supabase
    .from('hero_content')
    .upsert([{
      id: 1,
      title_en: heroContent.titleEn,
      title_ar: heroContent.titleAr,
      subtitle_en: heroContent.subtitleEn,
      subtitle_ar: heroContent.subtitleAr
    }])
    .select()
  
  if (error) {
    console.error('Error updating hero content:', error)
    throw error
  }
  
  return data[0]
}