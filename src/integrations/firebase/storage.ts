import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    type UploadTask,
} from "firebase/storage";
import { storage } from "./config";

export interface UploadProgress {
    progress: number;
    state: "running" | "paused" | "success" | "error";
}

// Resume upload
export function uploadResume(
    userId: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
): { task: UploadTask; getUrl: () => Promise<string> } {
    const filePath = `resumes/${userId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    const task = uploadBytesResumable(storageRef, file);

    if (onProgress) {
        task.on("state_changed", (snapshot) => {
            onProgress({
                progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                state: snapshot.state as UploadProgress["state"],
            });
        });
    }

    const getUrl = async () => {
        await task;
        return getDownloadURL(storageRef);
    };

    return { task, getUrl };
}

// Avatar upload
export async function uploadAvatar(
    userId: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<string> {
    const filePath = `avatars/${userId}/profile.${file.name.split(".").pop()}`;
    const storageRef = ref(storage, filePath);
    const task = uploadBytesResumable(storageRef, file);

    if (onProgress) {
        task.on("state_changed", (snapshot) => {
            onProgress({
                progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                state: snapshot.state as UploadProgress["state"],
            });
        });
    }

    await task;
    return getDownloadURL(storageRef);
}

// Delete file
export async function deleteFile(filePath: string) {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
}
