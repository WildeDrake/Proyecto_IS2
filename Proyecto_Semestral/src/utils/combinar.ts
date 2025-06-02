import { obtenerRecomendacionBase } from './parseTabla1';
import { filtrarActividades } from './parseTabla2';

export async function getResultado(condiciones: any) {
  const recomendacionBase = await obtenerRecomendacionBase(condiciones);
  const actividades = await filtrarActividades(condiciones);

  return {
    recomendacionBase,
    actividades
  };
}
