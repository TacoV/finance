import { ref } from 'vue'
import { type FileUploadUploaderEvent } from 'primevue/fileupload'
import { supabase } from '@/lib/supabase'
import { getUid } from '@/lib/auth'

const bucketName = 'dumps'
const fileList = ref<any[]>([])

async function uploadFile(uploadEvent: FileUploadUploaderEvent) {
    for (const bestand of uploadEvent.files as File[]) {
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(getUid() + '/' + bestand.name, bestand)
      if (error) {
        alert('Error uploading: ' + error.message)
      }
    }
    await retrieveFiles()
  }
  
  async function retrieveFiles() {
    const { data, error } = await supabase.storage.from(bucketName).list(getUid())
    if (error) {
      alert('Error listing files: ' + error.message)
    }
    if (data) {
      fileList.value = data
    }
  }

  
  async function deleteFile(filename: string) {
    const { error } = await supabase.storage.from(bucketName).remove([getUid() + '/' + filename])
    if (error) {
      alert('Error deleting file: ' + error.message)
    }
    await retrieveFiles()
  }
  
  export { fileList, uploadFile, deleteFile }