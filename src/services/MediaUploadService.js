import * as ImagePicker from 'expo-image-picker';
import firebase from '../firebaseConfig';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

const COVER_PICKER_OPTIONS = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [3, 4],
  quality: 0.8,
};

const CHAT_PICKER_OPTIONS = {
  mediaTypes: ['images'],
  quality: 0.8,
};

export function isRemoteUrl(value) {
  return /^https?:\/\//i.test(String(value || ''));
}

export function normalizeRemoteUrl(value) {
  return String(value || '').replace(/^http:/, 'https:');
}

function getPickedImageUri(result) {
  if (result.canceled) {
    return '';
  }

  return result.assets?.[0]?.uri || '';
}

export async function pickCoverImageFromLibrary() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Permita acesso a galeria para escolher uma imagem.');
  }

  return getPickedImageUri(await ImagePicker.launchImageLibraryAsync(COVER_PICKER_OPTIONS));
}

export async function takeCoverPhoto() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Permita o acesso a camera para tirar uma foto.');
  }

  return getPickedImageUri(await ImagePicker.launchCameraAsync(COVER_PICKER_OPTIONS));
}

export async function pickChatImageFromLibrary() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Permita acesso a galeria para enviar uma imagem.');
  }

  return getPickedImageUri(await ImagePicker.launchImageLibraryAsync(CHAT_PICKER_OPTIONS));
}

export async function uploadImageUri(localUri, storagePath) {
  if (!localUri) {
    return '';
  }

  if (isRemoteUrl(localUri)) {
    return normalizeRemoteUrl(localUri);
  }

  const storage = getStorage(firebase);
  const response = await fetch(localUri);
  const blob = await response.blob();
  const fileRef = storageRef(storage, storagePath);

  await uploadBytes(fileRef, blob);
  return await getDownloadURL(fileRef);
}
