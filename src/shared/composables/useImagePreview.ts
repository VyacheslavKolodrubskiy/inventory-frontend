export function useImagePreview() {
  const previewVisible = ref(false);
  const previewImage = ref('');
  const previewTitle = ref('');

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview)
      file.preview = (await getBase64(file.originFileObj)) as string;

    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  };

  const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
  };

  return { previewVisible, previewImage, previewTitle, handlePreview, handleCancel };
}
