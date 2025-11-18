import  { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = () => {
    if (formData.email && formData.subject && formData.message) {
      alert('Message envoyé avec succès!');
      setFormData({ email: '', subject: '', message: '' });
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions ou contactez notre équipe pour une assistance personnalisée.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
          {/* Service Client Card */}
          <div className="bg-black text-white p-6 md:p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <Phone className="w-8 h-8 mr-3" />
              <h2 className="text-xl md:text-2xl font-bold">Service Client</h2>
            </div>
            <p className="text-gray-300 mb-4">Disponible 7j/7 de 8h à 22h</p>
            <a href="tel:+212613235677" className="text-lg md:text-xl font-semibold hover:text-gray-300 transition">
              +224 61 32 35 67 7
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-black text-white p-6 md:p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <MessageCircle className="w-8 h-8 mr-3" />
              <h2 className="text-xl md:text-2xl font-bold">WhatsApp</h2>
            </div>
            <p className="text-gray-300 mb-2">Réponse rapide par message</p>
            <p className="text-gray-300">Démarrer une discussion</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-black">
                Bienvenue chez Durama
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Votre partenaire dédié à votre satisfaction. Notre équipe est là pour répondre à toutes vos questions et vous offrir un service exceptionnel.
              </p>
            </div>

            {/* Hours */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 mr-2 text-black" />
                <h4 className="font-semibold text-black">Horaires:</h4>
              </div>
              <p className="text-sm text-gray-700">Lundi - Vendredi : 9h - 17h</p>
              <p className="text-sm text-gray-700">Weekend : 10h - 14h</p>
            </div>

            {/* Office */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-3">
                <MapPin className="w-5 h-5 mr-2 text-black" />
                <h4 className="font-semibold text-black">Bureau ouvert</h4>
              </div>
              <p className="text-sm text-gray-700">Yattaya, C/Ratoma</p>
            </div>

            {/* Phone */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-3">
                <Phone className="w-5 h-5 mr-2 text-black" />
                <h4 className="font-semibold text-black">Numéro de téléphone</h4>
              </div>
              <a href="tel:+224613235677" className="text-sm text-gray-700 hover:text-black transition">
                +224 624 65 74 23
              </a>
            </div>

            {/* Email */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-3">
                <Mail className="w-5 h-5 mr-2 text-black" />
                <h4 className="font-semibold text-black">Adresse E-mail</h4>
              </div>
              <a href="mailto:contact@kambily.com" className="text-sm text-gray-700 hover:text-black transition">
                contact@Durma.com
              </a>
            </div>

            {/* Social Media */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-black mb-4">Suivez-nous sur les réseaux sociaux</h4>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                  <span className="text-sm font-bold">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                  <span className="text-sm font-bold">in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                  <span className="text-sm font-bold">tw</span>
                </a>
                <a href="#" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                  <span className="text-sm font-bold">p</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black">
                Contactez-nous
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Votre adresse mail *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-black transition"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-black transition"
                    placeholder="Objet de votre message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Votre message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-black transition resize-none"
                    placeholder="Écrivez votre message ici..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-black text-white py-4 rounded font-semibold hover:bg-gray-800 transition flex items-center justify-center space-x-2"
                >
                  <span>Envoyer le message</span>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}