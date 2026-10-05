'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { UploadCloud, Loader2, X, Image as ImageIcon, Crop as CropIcon, Check } from 'lucide-react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/utils/cropImage'

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string | null;
  label?: string;
  folder?: string;
  aspect?: number;
  shape?: 'rect' | 'round';
}

export default function ImageUploader({ onUpload, currentImage, label = 'اختر صورة', folder = 'general', aspect, shape = 'rect' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    const reader = new FileReader()
    reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null))
    reader.readAsDataURL(file)
    
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    
    setUploading(true)
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (!croppedFile) throw new Error('خطأ في قص الصورة')

      const fileExt = 'png'
      const fileName = `${folder}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('pharmacy-assets')
        .upload(fileName, croppedFile, { upsert: false })

      if (error) {
        alert('خطأ أثناء الرفع: ' + error.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('pharmacy-assets')
        .getPublicUrl(fileName)

      onUpload(publicUrlData.publicUrl)
      setImageSrc(null)
    } catch (err) {
      alert('حدث خطأ غير متوقع.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      {imageSrc && (
        <div className="fixed inset-0 bg-slate-900/90 z-[9999] flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50" dir="rtl">
              <h3 className="font-bold flex items-center gap-2"><CropIcon size={18} /> قص ومعاينة الصورة</h3>
              <button onClick={() => setImageSrc(null)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            
            <div className="relative flex-1 bg-black w-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropShape={shape}
                showGrid={true}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-4 bg-slate-50 border-t flex flex-col sm:flex-row gap-4 items-center justify-between" dir="rtl">
              <div className="w-full sm:w-1/2 flex items-center gap-3">
                <span className="text-sm font-bold text-slate-500">تكبير:</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setImageSrc(null)} className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 font-bold hover:bg-slate-100">إلغاء</button>
                <button 
                  onClick={handleCropSave} 
                  disabled={uploading}
                  className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  {uploading ? 'جاري الرفع...' : 'قص وحفظ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <UploadCloud size={24} />
            <span className="text-sm font-medium">اضغط لرفع وقص صورة</span>
            <span className="text-xs text-slate-400">PNG, JPG (Max 5MB)</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      )}
    </div>
  )
}
