export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
  );
  const data = await response.json();
  const address = data.address;

  // Construye una dirección con los campos deseados
  const ciudad = address.city || address.town || address.village || "";
  const provincia = address.county || "";
  const region = address.state || "";
  const pais = address.country || "";

  return `${ciudad}, ${provincia}, ${region}, ${pais}`;
};  