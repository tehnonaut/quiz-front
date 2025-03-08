export const getStorageItem = (keyName: string) => {
	try {
		return JSON.parse(localStorage.getItem(keyName) || 'null');
	} catch (error: unknown) {
		console.error(error);
		return null;
	}
};

export const setStorageItem = (keyName: string, value: any) => {
	localStorage.setItem(keyName, JSON.stringify(value));
};

export const removeStorageItem = (keyName: string) => {
	localStorage.removeItem(keyName);
};

export const clearStorage = () => {
	localStorage.clear();
};
