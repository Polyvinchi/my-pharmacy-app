'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { UploadCloud, Loader2, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string | null;
  label?: string;
  folder?: string;
}

export default function ImageUploader({ onUpload, currentImage, label = 'اختر صورة', folder = 'general' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`

    try {
      const { data, error } = await supabase.storage
        .from('pharmacy-assets')
        .upload(fileName, file, { upsert: false })

      if (error) {
        console.error(error)
        alert('خطأ أثناء الرفع: ' + error.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('pharmacy-assets')
        .getPublicUrl(fileName)

      onUpload(publicUrlData.publicUrl)
    } catch (err) {
      console.error(err)
      alert('حدث خطأ غير متوقع.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      {currentImage ? (
        <div className="relative inline-block border rounded-xl overflow-hidden bg-slate-50 group">
          <img src={currentImage} alt="Uploaded" className="h-32 w-auto object-contain p-2" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button"
              onClick={() => onUpload('')}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform hover:scale-110"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-600">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-sm font-medium">جاري الرفع...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <UploadCloud size={24} />
              <span className="text-sm font-medium">اضغط لرفع صورة من جهازك</span>
              <span className="text-xs text-slate-400">PNG, JPG, SVG (Max 5MB)</span>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
            disabled={uploading}
          />
        </div>
      )}
    </div>
  )
}
