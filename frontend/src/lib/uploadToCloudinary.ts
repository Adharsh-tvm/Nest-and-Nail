export async function uploadToCloudinary(
    files: File[],
    signatureData: {
        cloudName: string;
        apiKey: string;
        timestamp: number;
        signature: string;
        folder: string;
    }
) {
    const uploads = files.map(async (file) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("api_key", signatureData.apiKey);
        formData.append("timestamp", signatureData.timestamp.toString());
        formData.append("signature", signatureData.signature);
        formData.append("folder", signatureData.folder);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();

        return {
            url: data.secure_url as string,
            width: data.width as number,
            height: data.height as number,
            bytes: data.bytes as number,
            format: data.format as string,
        };
    });

    return Promise.all(uploads);
}
