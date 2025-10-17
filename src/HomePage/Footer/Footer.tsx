import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="w-full py-7 bg-black">
        <div className="max-w-[1400px] mx-auto px-7">
            <div className="justify-between flex">
                <div className="">
                    <div>
                        <p className="text-white font-bold">Logo</p>
                    </div>
                    <div className="mt-4">
                        <p className="text-white font-bold">Adresse</p>
                        <p className="text-white/70">12 nongo, conakry Guinée</p>
                    </div>
                    <div className="mt-4">
                        <p className="text-white font-bold">Contact</p>
                        <p className="text-white/70">+224 622 65 68 58, durama@gmail.com</p>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <FaFacebook className="text-white" />
                        <FaInstagram className="text-white" />
                        <FaXTwitter className="text-white" />
                        <FaLinkedin className="text-white" />
                    </div>


                </div>
                <div className="flex gap-7">
                    <div className="leading-12">
                        <p className="text-white">Matériaux</p>
                        <p className="text-white">Outillage</p>
                        <p className="text-white">Sécurité</p>
                        <p className="text-white">Catégories</p>
                        <p className="text-white">Devis</p>
                    </div>
                    <div className="leading-12">
                        <p className="text-white">Contact</p>
                        <p className="text-white">Support</p>
                        <p className="text-white">Blog</p>
                        <p className="text-white">Guides</p>
                        <p className="text-white">Formations</p>
                    </div>
                    
                </div>
                

            </div>
            <div className="w-full mt-15 h-[1px] bg-gray-400"/>
            <div className="flex mt-4 justify-between">
                <div>
                    <p className="text-white">@2025 Durama. Tous droits réservés</p>
                </div>
                <div className="">
                    <p className="text-white hidden sm:block">Politique de confidentialité</p>

                </div>

            </div>


        </div>
      
    </div>
  )
}

export default Footer
