import { HorasDetalle, CreditosDetalle, SilaboData } from '../types';

export function calcularTotalesHoras(horas: HorasDetalle) {
  const totalTeoriaLectiva =
    (Number(horas.teoriaLectivaPresencial) || 0) + (Number(horas.teoriaLectivaDistancia) || 0);
  const totalTeoriaNoLectiva =
    (Number(horas.teoriaNoLectivaPresencial) || 0) + (Number(horas.teoriaNoLectivaDistancia) || 0);
  const totalTeoria = totalTeoriaLectiva + totalTeoriaNoLectiva;

  const totalPracticaLectiva =
    (Number(horas.practicaLectivaPresencial) || 0) + (Number(horas.practicaLectivaDistancia) || 0);
  const totalPracticaNoLectiva =
    (Number(horas.practicaNoLectivaPresencial) || 0) +
    (Number(horas.practicaNoLectivaDistancia) || 0);
  const totalPractica = totalPracticaLectiva + totalPracticaNoLectiva;

  const totalHoras = totalTeoria + totalPractica;

  return {
    totalTeoriaLectiva,
    totalTeoriaNoLectiva,
    totalTeoria,
    totalPracticaLectiva,
    totalPracticaNoLectiva,
    totalPractica,
    totalHoras,
  };
}

export function validarCoherenciaHorasYCreditos(silabo: SilaboData) {
  const { horas, creditos } = silabo.datosGenerales;
  const totales = calcularTotalesHoras(horas);

  // Sumar horas programadas semana a semana en la sección IV
  let sumaTeoriaLectivaProgramada = 0;
  let sumaPracticaLectivaProgramada = 0;
  let sumaTeoriaNoLectivaProgramada = 0;
  let sumaPracticaNoLectivaProgramada = 0;

  silabo.programacionContenidos.unidades.forEach((unidad) => {
    unidad.semanas.forEach((sem) => {
      sumaTeoriaLectivaProgramada += Number(sem.horasLectivas.teoria) || 0;
      sumaPracticaLectivaProgramada += Number(sem.horasLectivas.practica) || 0;
      sumaTeoriaNoLectivaProgramada += Number(sem.horasNoLectivas.teoria) || 0;
      sumaPracticaNoLectivaProgramada += Number(sem.horasNoLectivas.practica) || 0;
    });
  });

  const totalProgramado =
    sumaTeoriaLectivaProgramada +
    sumaPracticaLectivaProgramada +
    sumaTeoriaNoLectivaProgramada +
    sumaPracticaNoLectivaProgramada;

  // En la normativa peruana típica:
  // 1 crédito teórico = 16 horas lectivas (presenciales o a distancia con docente)
  // 1 crédito práctico = 32 horas lectivas
  const creditosTeoriaEsperados = Math.round(totales.totalTeoriaLectiva / 16) || Math.round(totales.totalTeoria / 16);
  const creditosPracticaEsperados = Math.round(totales.totalPracticaLectiva / 8) || Math.round(totales.totalPractica / 32);

  const advertencias: string[] = [];

  if (totalProgramado > 0 && Math.abs(totalProgramado - totales.totalHoras) > 0) {
    advertencias.push(
      `Discrepancia en cronograma: Las horas declaradas en Datos Generales (${totales.totalHoras} hrs) difieren de las horas sumadas semana a semana en la Programación (${totalProgramado} hrs).`
    );
  }

  if (creditos.total !== creditos.teoria + creditos.practica) {
    advertencias.push(
      `Inconsistencia aritmética: Créditos teóricos (${creditos.teoria}) + Créditos prácticos (${creditos.practica}) no coinciden con el total declarado (${creditos.total}).`
    );
  }

  return {
    totales,
    sumaProgramada: {
      teoriaLectiva: sumaTeoriaLectivaProgramada,
      practicaLectiva: sumaPracticaLectivaProgramada,
      teoriaNoLectiva: sumaTeoriaNoLectivaProgramada,
      practicaNoLectiva: sumaPracticaNoLectivaProgramada,
      total: totalProgramado,
    },
    creditosTeoriaEsperados,
    creditosPracticaEsperados,
    esCoherente: advertencias.length === 0,
    advertencias,
  };
}
