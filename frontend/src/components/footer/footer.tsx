import PinkButton from "../buttons/pink_button";

const Footer = () => {
  return (
    <footer className="bg-[#3A2F6F] w-full flex flex-col shadow-md p-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between sm:space-y-0 space-y-6">

        <div className="flex-1 mb-4 sm:mb-0 pl-4 sm:pl-10">
          <h3 className="text-lg font-bold mb-3">Abi</h3>
          <p className="mb-1">Kasutustingimused</p>
          <p className="mb-1">Tarnetingimused</p>
          <p>Privaatsuspoliitika</p>
        </div>

        <div className="flex-1 mb-4 sm:mb-0 pl-4 sm:pl-0">
          <h3 className="text-lg font-bold mb-2">Klienditugi</h3>
          <p className="mb-1">info@raamatupood.ee</p>
          <p>Info: +372 775 4834</p>
        </div>

        <div className="flex-1 pl-4 sm:pl-3 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-bold mb-2">Kaupluse info</h3>
            <p className="mb-1">Ehitajate tee 5, Tallinn</p>
            <p className="mb-1">E-R 9:00-18:00</p>
            <p className="mb-1">L 12:00-15:00</p>
            <p>P Suletud</p>
          </div>

          <div className="hidden sm:block">
            <PinkButton label="Tagasiside" navigateTo="/tagasiside" />
          </div>
        </div>
      </div>

      <div className="block sm:hidden mt-6 flex justify-center">
        <PinkButton label="Tagasiside" navigateTo="/tagasiside" />
      </div>

      <div className="mt-6 text-center text-sm sm:text-base">
        Raamatupood © 2024
      </div>
    </footer>
  );
};

export default Footer;
