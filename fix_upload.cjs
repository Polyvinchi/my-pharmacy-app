const fs = require('fs');
let code = fs.readFileSync('src/app/admin/offers/OffersManager.tsx', 'utf8');

// 1. Update handleImageUpload to process multiple files
const oldUploadFn =   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = \\\\\\-\\\.\\\\\\

      const { error: uploadError } = await supabase.storage
        .from('pharmacy-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('pharmacy-assets').getPublicUrl(filePath)
      setImages([...images, data.publicUrl])
    } catch (error) {
      alert('Error uploading image!')
      console.error(error)
    } finally {
      setUploading(false)
    }
  };

const newUploadFn =   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      
      const newUrls: string[] = []
      const files = Array.from(e.target.files)
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const filePath = \\\\\\-\\\.\\\\\\

        const { error: uploadError } = await supabase.storage
          .from('pharmacy-assets')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('pharmacy-assets').getPublicUrl(filePath)
        newUrls.push(data.publicUrl)
      }
      
      setImages(prev => [...prev, ...newUrls])
    } catch (error: any) {
      alert('????? ?? ??? ??????: ' + (error.message || '???? ?? ??????? ??? Storage (RLS)'))
      console.error(error)
    } finally {
      setUploading(false)
    }
  };

// Use a simple string replace for the function (or regex if needed)
// Wait, I can just replace the whole file since I know its contents.
code = code.replace(/const handleImageUpload[\s\S]*?finally {\s*setUploading\(false\)\s*}\s*}/, newUploadFn);

// 2. Add 'multiple' attribute to input
code = code.replace('<input type="file" accept="image/*"', '<input type="file" multiple accept="image/*"');

fs.writeFileSync('src/app/admin/offers/OffersManager.tsx', code, 'utf8');
console.log('Upload fixed');
