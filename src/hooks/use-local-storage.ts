import { useMemo, useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export type UseLocalStorageReturn<T> = {
  state: T;
  canReset: boolean;
  resetState: () => void;
  setState: (updateState: T | Partial<T>) => void;
  setField: (name: keyof T, updateValue: T[keyof T]) => void;
};

export function useLocalStorage<T>(key: string, initialState: T): UseLocalStorageReturn<T> {
  const [state, set] = useState(initialState);

  const multiValue = initialState && typeof initialState === 'object';

  const canReset = JSON.stringify(state) !== JSON.stringify(initialState);

  useEffect(() => {
    const restoredValue: T = getStorage(key);

    if (restoredValue) {
      if (multiValue) {
        set((prevValue) => ({ ...prevValue, ...restoredValue }));
      } else {
        set(restoredValue);
      }
    }
  }, [key, multiValue]);

  const setState = useCallback(
    (updateState: T | Partial<T>) => {
      if (multiValue) {
        set((prevValue) => {
          setStorage<T>(key, { ...prevValue, ...updateState });
          return { ...prevValue, ...updateState };
        });
      } else {
        setStorage<T>(key, updateState as T);
        set(updateState as T);
      }
    },
    [key, multiValue]
  );

  const setField = useCallback(
    (name: keyof T, updateValue: T[keyof T]) => {
      if (multiValue) {
        setState({ [name]: updateValue } as Partial<T>);
      }
    },
    [multiValue, setState]
  );

  const resetState = useCallback(() => {
    set(initialState);
    removeStorage(key);
  }, [initialState, key]);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
      setField,
      resetState,
      canReset,
    }),
    [canReset, resetState, setField, setState, state]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function getStorage(key: string) {
  try {
    const result = localStorage.getItem(key);
    if (result) {
      const valueDecrypted = decryptData(result);
      if (valueDecrypted) {
        if (valueDecrypted.startsWith('{') || valueDecrypted.startsWith('[')) {
          try {
            const parsedValue = JSON.parse(valueDecrypted);
            return parsedValue;
          } catch (error) {
            return valueDecrypted; // No se pudo parsear, devolver el valor como string
          }
        }

        // Si no es un objeto JSON, devolver directamente el valor desencriptado
        return valueDecrypted;
      }
    }
  } catch (error) {
    console.error('Error while getting from storage:', error);
  }

  return null;
}

export function setStorage<T>(key: string, value: T) {
  try {
    let valueEncrypted;
    if (typeof value === 'object' || Array.isArray(value)) {
      valueEncrypted = encryptData(JSON.stringify(value));
    } else {
      valueEncrypted = encryptData(value as string);
    }

    if (valueEncrypted) {
      window.localStorage.setItem(key, valueEncrypted);
    }
  } catch (error) {
    console.error('Error while setting storage:', error);
  }
}

export function removeStorage(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error while removing from storage:', error);
  }
}

// encriptar datos
export function encryptData(data: string) {
  try {
    return btoa(data);
  } catch (error) {
    console.error('Error while encrypting data:', error);
    return null;
  }
}

// desencriptar datos
export function decryptData(data: string) {
  try {
    return atob(data);
  } catch (error) {
    console.error('Error while decrypting data:', error);
    return null;
  }
}
