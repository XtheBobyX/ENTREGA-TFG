export interface Encuesta {
  id_encuesta?: number;
  post_id?: number;
  titulo: string;
  expira_en?: Date | null;
  multiple_opciones: boolean;
}
