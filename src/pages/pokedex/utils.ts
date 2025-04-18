import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export function capitilize(str = '') {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

export const normalizePokemonName = (text: string) => {
  // edge cases
  text = text.replace('nidoran-m', 'nidoran ♂');
  text = text.replace('nidoran-f', 'nidoran ♀');
  text = text.replace('mr-mime', 'mr. Mime');
  text = text.replace('mime-jr', 'mime Jr.');
  text = text.replace('mr-rime', 'mr. Rime');
  text = text.replace('-altered', '');
  text = text.replace('-land', '');
  text = text.replace('-red-striped', ' (Red Striped)');
  text = text.replace('-blue-striped', ' (Blue Striped)');
  text = text.replace('-white-striped', ' (White Striped)');
  text = text.replace('-standard', '');
  text = text.replace('-standard', '');
  text = text.replace('-incarnate', ' (Incarnate)');
  text = text.replace('-therian', ' (Therian)');
  text = text.replace('-ordinary', '');
  text = text.replace('-aria', '(Aria)');
  text = text.replace('-unbound', '(Unbound)');
  text = text.replace('-male', ' ♂');
  text = text.replace('-female', ' ♀');
  text = text.replace('-50', '(50%)');
  text = text.replace('-baile', ' (Baile)');
  text = text.replace('-pom-pom', ' (Pom-Pom)');
  text = text.replace('-pau', ' (Pa\'u)');
  text = text.replace('-sensu', ' (Sensu)');
  text = text.replace('-disguised', '');
  text = text.replace('-full-belly', '');
  text = text.replace('-single-strike', '');
  text = text.replace('-green-plumage', '(Green Plumage)');
  text = text.replace('-yellow-plumage', '(Yellow Plumage)');
  text = text.replace('-blue-plumage', '(Blue Plumage)');
  text = text.replace('-white-plumage', '(White Plumage)');
  text = text.replace('-curly', '');
  text = text.replace('-alola', ' (Alola)');
  text = text.replace('-galar', ' (Galar)');
  text = text.replace('-gmax', ' (Gigantamax)');
  text = text.replace('-mega-x', ' (Mega X)');
  text = text.replace('-mega-y', ' (Mega Y)');
  text = text.replace('-mega', ' (Mega)');
  text = text.replace('-hisui', ' (Hisui)');
  text = text.replace('-heat', ' (Heat)');
  text = text.replace('-wash', ' (Wash)');
  text = text.replace('-frost', ' (Frost)');
  text = text.replace('-fan', ' (Fan)');
  text = text.replace('-mow', ' (Mow)');

  return capitilize(text);
};

export const kebabToSpace = (name: string) => {
  return name.replaceAll('-',' ');
};

export const getIdFromUrlSubstring = (url = '') => url.split("/")[url.split("/").length - 2];


export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (e) {
      console.log(e);
    }
    return () => {
      isMounted.current = false;
    };
  }, [key]);

  useEffect(() => {
    if (isMounted.current) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      isMounted.current = true;
    }
  }, [key, value]);

  return [value, setValue];
}