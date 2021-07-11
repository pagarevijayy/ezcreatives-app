import Meta from "./meta";

const Header = () => {
  return (
    <>
      <Meta />
      <div className="header text-center px-12 py-5 shadow-sm">
        <div className="max-w-screen-2xl mx-auto">
          <p className="font-poppins font-bold text-2xl tracking-wide select-none cursor-pointer transform transition hover:-translate-y-0.5">
            ez <span className="text-cyan-500 uppercase">Creatives</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;
