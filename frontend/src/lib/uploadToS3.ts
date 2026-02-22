import axios from "axios";

export async function uploadToS3(
    file: File,
    uploadUrl: string
): Promise<boolean> {
    try {
        const config = {
            headers: {
                "Content-Type": file.type,
            },
        };

        await axios.put(uploadUrl, file, config);
        return true;
    } catch (error) {
        console.error("Error uploading to S3:", error);
        return false;
    }
}
