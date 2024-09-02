import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { addMedicalProfessional, connectWallet } from '../utils/contractInteraction';

const Professionals = () => {
  const { healthProfessionals, fetchHealthProfessionals, createHealthProfessional } = useStateContext();
  const [newProfessional, setNewProfessional] = useState({
    name: '',
    specialization: '',
    pictureUrl: '',
    qualifications: '',
    yearsOfExperience: '',
    contactEmail: '',
    contactPhone: '',
    ethAddress: '', // Add this field
  });

  useEffect(() => {
    fetchHealthProfessionals();
  }, [fetchHealthProfessionals]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfessional(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connect wallet and get address
      const address = await connectWallet();
      
      // Add professional to the smart contract
      await addMedicalProfessional(address);

      // Create professional in the database
      await createHealthProfessional({
        ...newProfessional,
        qualifications: newProfessional.qualifications.split(',').map(q => q.trim()),
        yearsOfExperience: parseInt(newProfessional.yearsOfExperience),
        ethAddress: address,
      });

      setNewProfessional({
        name: '',
        specialization: '',
        pictureUrl: '',
        qualifications: '',
        yearsOfExperience: '',
        contactEmail: '',
        contactPhone: '',
        ethAddress: '',
      });

      // Refresh the list of professionals
      fetchHealthProfessionals();
    } catch (error) {
      console.error("Error creating health professional:", error);
      alert("Failed to create health professional. Please make sure you're connected to MetaMask and try again.");
    }
  };

  return (
    <div className="flex flex-col p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Health Professionals</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-[#1c1c24] p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newProfessional.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="w-full p-2 bg-[#2c2f32] rounded border border-gray-700 text-white"
          />
          <input
            type="text"
            name="specialization"
            value={newProfessional.specialization}
            onChange={handleInputChange}
            placeholder="Specialization"
            className="w-full p-2 bg-[#2c2f32] rounded border border-gray-700 text-white"
          />
          <input
            type="text"
            name="pictureUrl"
            value={newProfessional.pictureUrl}
            onChange={handleInputChange}
            placeholder="Picture URL"
            className="w-full p-2 bg-[#2c2f32] rounded border border-gray-700 text-white"
          />
          <input
            type="text"
            name="qualifications"
            value={newProfessional.qualifications}
            onChange={handleInputChange}
            placeholder="Qualifications (comma-separated)"
            className="w-full p-2 bg-[#2c2f32] rounded border border-gray-700 text-white"
          />
          <input
            type="number"
            name="yearsOfExperience"
            value={newProfessional.yearsOfExperience}
            onChange={handleInputChange}
            placeholder="Years of Experience"
            className="w-full p-2 bg-[#2c2f32] rounded border border-gray-700 text-white"
          />
          <input
            type="email"
            name="contactEmail"
            value={newProfessional.contactEmail}
            onChange={handleInputChange}
            placeholder="Contact Email"
            className="w-full p-2 bg-[#2c2f32] rounded border border-gray-700 text-white"
          />
          <input
            type="tel"
            name="contactPhone"
            value={newProfessional.contactPhone}
            onChange={handleInputChange}
            placeholder="Contact Phone"
            className="w-full p-2 bg-[#2c2f32] rounded border border-gray-700 text-white"
          />
          <input
            type="text"
            name="ethAddress"
            value={newProfessional.ethAddress}
            onChange={handleInputChange}
            placeholder="Ethereum Address (optional)"
            className="w-full p-2 bg-[#2c2f32] rounded border border-gray-700 text-white"
          />
        </div>
        <button type="submit" className="mt-4 bg-[#1dc071] text-white p-2 rounded hover:bg-[#1ab069] transition-colors">
          Add Professional
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthProfessionals.map(professional => (
          <div key={professional.id} className="bg-[#1c1c24] p-4 rounded-lg">
            <img src={professional.pictureUrl} alt={professional.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-xl font-bold mb-2">{professional.name}</h2>
            <p className="text-[#1dc071] mb-2">{professional.specialization}</p>
            <p className="mb-2">Experience: {professional.yearsOfExperience} years</p>
            <p className="mb-2">Email: {professional.contactEmail}</p>
            <p className="mb-2">Phone: {professional.contactPhone}</p>
            <div className="mt-2">
              <h3 className="font-semibold mb-1">Qualifications:</h3>
              <ul className="list-disc list-inside">
                {professional.qualifications.map((qual, index) => (
                  <li key={index}>{qual}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Professionals;