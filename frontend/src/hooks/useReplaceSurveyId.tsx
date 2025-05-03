import { useLocation, useNavigate } from "react-router-dom";

/** Подменяет сегмент‑ID сразу после `/survey/…` */
export function useReplaceSurveyId(): (id: string | number) => void {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (id: string | number) => {
    /*  ^\/survey\/     — начало   "/survey/"
        ([^/]+)         — текущий   "new"
        (\/.*)?$        — остальное "/edit"  (или пусто) */
    const newPath = pathname.replace(/^\/survey\/[^/]+(\/.*)?$/, (_m, tail = "") => `/survey/${id}${tail}`);

    navigate(newPath, { replace: true });
  };
}
