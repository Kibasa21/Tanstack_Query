import { useIsFetching } from "@tanstack/react-query";

export default function Header({ children }) {

  const isFetching = useIsFetching();//useIsFetching returns the number of queries that are currently fetching data

  return (
    <>
      <div id="main-header-loading">{isFetching > 0 && <progress />}</div>
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
