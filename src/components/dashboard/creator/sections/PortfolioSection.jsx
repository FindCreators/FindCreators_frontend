import React, { useState } from "react";
import { Plus, ExternalLink, Pencil, X } from "lucide-react";
import AddWorkModal from "./AddWorkModal";

const PortfolioSection = ({ profile, onEdit }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newWork, setNewWork] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    tags: [],
  });

  const portfolioItems = profile?.portfolio || [];

  const openEditModal = (item, index) => {
    setNewWork(item);
    setEditMode(true);
    setEditIndex(index);
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updatedPortfolio;
    if (editMode) {
      updatedPortfolio = [...portfolioItems];
      updatedPortfolio[editIndex] = newWork;
    } else {
      updatedPortfolio = [...portfolioItems, newWork];
    }

    onEdit({ portfolio: updatedPortfolio }, "portfolio");
    setShowAddModal(false);
    setEditMode(false);
    setEditIndex(null);
    setNewWork({ title: "", description: "", image: "", link: "", tags: [] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWork((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setNewWork((prevState) => ({
      ...prevState,
      tags,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Portfolio</h2>
        <button
          onClick={() => {
            setEditMode(false);
            setNewWork({
              title: "",
              description: "",
              image: "",
              link: "",
              tags: [],
            });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Work
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {portfolioItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-video relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg hover:bg-black/70 text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => openEditModal(item, index)}
                className="mt-2 text-blue-600 hover:underline flex items-center gap-1"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {portfolioItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No portfolio items added yet.</p>
        </div>
      )}

      {showAddModal && (
        <AddWorkModal
          newWork={newWork}
          handleInputChange={handleInputChange}
          handleTagsChange={handleTagsChange}
          handleSubmit={handleSubmit}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default PortfolioSection;
