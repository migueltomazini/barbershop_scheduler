export function calculateEndTime(startTime: string, durationMinutes: number): string {
  if (!startTime || durationMinutes == null || durationMinutes < 0) {
    console.warn("Invalid startTime or duration for endTime calculation.");
    return ""; // Ou poderia retornar o startTime ou lançar um erro
  }
  const timeParts = startTime.split(':');
  if (timeParts.length !== 2) {
    console.warn("Invalid startTime format for endTime calculation:", startTime);
    return "";
  }

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) {
    console.warn("Invalid number parsing for startTime:", startTime);
    return "";
  }

  const totalStartMinutes = hours * 60 + minutes;
  const totalEndMinutes = totalStartMinutes + durationMinutes;

  const endHours = Math.floor(totalEndMinutes / 60); // Pode passar de 23 se o serviço for muito longo
  const endMinutes = totalEndMinutes % 60;

  // Formata para HH:MM. Considerar o que acontece se endHours >= 24.
  // Para este exemplo, vamos permitir que horas passem de 23 se necessário,
  // mas em um sistema real você poderia querer dividir em dias ou validar.
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}