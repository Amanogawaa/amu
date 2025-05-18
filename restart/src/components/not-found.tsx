const NotFoundPage = () => {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-9xl font-extrabold text-black font-satoshi tracking-widest">
        404
      </h1>
      <p className="text-black bg-white p-5 w-96 font-inter text-wrap text-center whitespace-wrap ">
        Let's be honest though -- 99% of the time, the 404 page is the fault of
        the person who made the website. I probably broke a link somewhere when
        working on a page.
      </p>

      <button className="mt-5">
        <a
          href="/"
          className="relative inline-block text-sm font-medium text-stone-700 group active:text-stone-600 focus:outline-none focus:ring"
        >
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-Evergreen_Dusk group-hover:translate-y-0 group-hover:translate-x-0"></span>
          <span className="relative block px-8 py-3  bg-gray-50 border border-current">
            Go Home
          </span>
        </a>
      </button>
    </main>
  );
};

export default NotFoundPage;
