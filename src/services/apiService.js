const BASE_URL = 'http://api.programator.sk';

export const fetchGalleryData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/gallery`);
        if (!response.ok) {
            throw new Error('Failed to fetch gallery data');
        }
        const data = await response.json();
        if (!data || !data.galleries) {
            throw new Error('Unexpected data structure from API');
        }

        const mappedData = data.galleries.map((gallery, index) => ({
            id: index,
            text: decodeURIComponent(gallery.name),
            mainImage: gallery.image ? `${BASE_URL}/images/300x200/${gallery.image.fullpath}` : null,
            relatedImages: [],
            numberOfImages: 0
        }));

        return Promise.all(mappedData.map(async box => {
            if (!box.mainImage) {
                return box;
            }

            const encodedCategory = encodeURIComponent(box.text);
            const categoryResponse = await fetch(`${BASE_URL}/gallery/${encodedCategory}`);
            const categoryData = await categoryResponse.json();
            if (categoryData && categoryData.images) {
                box.relatedImages = categoryData.images.map(image => `${BASE_URL}/images/300x200/${image.fullpath}`);
                box.numberOfImages = categoryData.images.length;
            }
            return box;
        }));

    } catch (error) {
        console.error('Error in fetchGalleryData:', error);
        throw error;
    }
};

export const fetchPhotosData = async (category) => {
    try {
        const encodedCategory = encodeURIComponent(category);
        const response = await fetch(`${BASE_URL}/gallery/${encodedCategory}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch photos for category: ${category}`);
        }
        const data = await response.json();
        if (!data || !data.images) {
            throw new Error('Unexpected data structure');
        }
        return data.images.map(image => `${BASE_URL}/images/300x200/${image.fullpath}`);
    } catch (error) {
        console.error('Error in fetchPhotosData:', error);
        throw error;
    }
};

export const deleteGallery = async (galleryName) => {
    try {
        const response = await fetch(`${BASE_URL}/gallery/${encodeURIComponent(galleryName)}`, {
            method: 'DELETE',
            headers: {
                // Include any necessary headers here, such as Content-Type or Authorization
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete gallery: ${galleryName}`);
        }

        // You might not need to return JSON if your DELETE operation does not send back a body
        // Just return a success message or status
        return 'Gallery deleted successfully';
    } catch (error) {
        console.error('Error in deleteGallery:', error);
        throw error;
    }
};