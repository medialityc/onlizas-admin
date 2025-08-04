const Footer = () => {
    return (
      <div className="p-6 pt-0 mt-auto  bg-white dark:bg-black text-center dark:text-white-dark ltr:sm:text-left rtl:sm:text-right">
        © {new Date().getFullYear()}. Medialityc Todos los derechos reservados.
      </div>
    );
};

export default Footer;
