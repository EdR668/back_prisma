export const normalizeString = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

export const normalizeStrings = (strings: string[]) => {
  return strings.map((value: string) => normalizeString(value));
}

export const createRegexFromFilter = (filter: string[] | string) => {
  if (Array.isArray(filter)) {
    return new RegExp(filter.join("|"), "i");
  }
  return new RegExp(filter, "i");
};

export const filterResponseByRegex = (responseObject: any[], fields: string[], filters: { [key: string]: string[] }) => {
  const normalizedResponse = responseObject.map(item => {
    const normalizedItem: any = { ...item };
    fields.forEach(field => {
      if (item[field]) {
        normalizedItem[field] = normalizeString(item[field]);
      }
    });
    return normalizedItem;
  });

  const filteredResponse = normalizedResponse.filter(item => {
    return fields.every(field => {
      if (filters[field]) {
        return filters[field].some(filterValue => {
          const regex = new RegExp(normalizeString(filterValue), "i");
          return regex.test(item[field]);
        });
      }
      return true;
    });
  });

  return filteredResponse.map(item => item._id);
};

export const getObjectsByIds = (responseObject: any[], ids: string[]) => {
  return responseObject.filter(item => ids.includes(item._id));
};

// TODO: Los valores en la base de datos no estan normalizados, agregar a los campos de texto la validación
// de cadenas tomando en cuenta acentos y diacríticos.
// -> Mientras se soluciona, el controlador de la API debe hacer la normalización de los valores de entrada
//    antes de retornar la respuesta.
export const addFiltersToQuery = (query: any, exactFields: string[]) => {
  const filter: any = {};

  exactFields.forEach(field => {
    if (query[field]) {
      if (Array.isArray(query[field])) {
        filter[field] = { $in: query[field] };
      } else {
        filter[field] = query[field];
      }
    }
  });

  return filter;
}