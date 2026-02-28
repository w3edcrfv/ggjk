import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import HomePage from "../pages/home/HomePage";
import SelectScalePage from "../pages/scale/SelectScalePage";
import AssessmentPage from "../pages/assessment/AssessmentPage";
import ResultPage from "../pages/result/ResultPage";
import ReportPage from "../pages/report/ReportPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/select-scale/:targetId",
    element: <SelectScalePage />,
  },
  {
    path: "/assessment/:targetId/:scaleId",
    element: <AssessmentPage />,
  },
  {
    path: "/result/:resultId",
    element: <ResultPage />,
  },
  {
    path: "/report/:resultId",
    element: <ReportPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
