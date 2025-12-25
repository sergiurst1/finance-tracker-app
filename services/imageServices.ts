export const getProfileImage= (file: any) => {
    if (file && typeof file === 'string') return file;
    if (file && typeof file === 'object' && 'uri' in file) return file.uri;

    return require('../assets/images/defaultAvatar.png');
};