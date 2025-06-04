import { getRecoBase } from './RecoBase';
import { getActRecomendadas } from './recoDb';

export async function getRecoPersonalizada(condiciones: any) {
  const recomendacionBase = await getRecoBase(condiciones);
  const actividades = await getActRecomendadas(condiciones);

  return {
    recomendacionBase,
    actividades
  };
}
