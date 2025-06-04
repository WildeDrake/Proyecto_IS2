import { obtenerRecomendacionBase } from './parseTabla1';
import { filtrarActividades } from './parseTabla2';
import { actividadesRecomendadas } from './recoDb';

export async function getResultado(condiciones: any) {
  const recomendacionBase = await obtenerRecomendacionBase(condiciones);
  //const actividades = await filtrarActividades(condiciones);
  const actividades = await actividadesRecomendadas(condiciones);

  return {
    recomendacionBase,
    actividades
  };
}
