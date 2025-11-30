import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<string> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("O arquivo deve ser uma imagem");
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error("A imagem deve ter no máximo 5MB");
  }

  const fileExtension = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const fileName = `${userId}_${timestamp}.${fileExtension}`;

  const storageRef = ref(storage, `profile-images/${fileName}`);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const compressImage = (
  file: File,
  maxWidth: number = 400,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Erro ao criar contexto do canvas"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Erro ao comprimir imagem"));
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsDataURL(file);
  });
};

export const uploadProfileImageWithCompression = async (
  userId: string,
  file: File
): Promise<string> => {
  const compressedBlob = await compressImage(file);
  
  const compressedFile = new File(
    [compressedBlob],
    `profile_${userId}.jpg`,
    { type: "image/jpeg" }
  );

  return uploadProfileImage(userId, compressedFile);
};