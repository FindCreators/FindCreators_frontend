import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const KYCModal = ({ isOpen, onClose, onSubmit }) => {
  const [documents, setDocuments] = useState({
    cin: "",
    pan: "",
    gst: "",
    cinDoc: null,
    panDoc: null,
    gstDoc: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (field, file) => {
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }
    setDocuments((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("cin", documents.cin);
      formData.append("pan", documents.pan);
      formData.append("gst", documents.gst);
      formData.append("cinDoc", documents.cinDoc);
      formData.append("panDoc", documents.panDoc);
      formData.append("gstDoc", documents.gstDoc);

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Verify Your Company</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* CIN Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CIN Number
                </label>
                <input
                  type="text"
                  value={documents.cin}
                  onChange={(e) =>
                    setDocuments({ ...documents, cin: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter CIN number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CIN Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange("cinDoc", e.target.files[0])
                  }
                  className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  required
                />
              </div>
            </div>

            {/* PAN Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number
                </label>
                <input
                  type="text"
                  value={documents.pan}
                  onChange={(e) =>
                    setDocuments({ ...documents, pan: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter PAN number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange("panDoc", e.target.files[0])
                  }
                  className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  required
                />
              </div>
            </div>

            {/* GST Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  value={documents.gst}
                  onChange={(e) =>
                    setDocuments({ ...documents, gst: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter GST number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileChange("gstDoc", e.target.files[0])
                  }
                  className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Submit Documents
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const KYCVerification = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("not_submitted");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://findcreators-537037621947.asia-south2.run.app/api/kyc",
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const document = response.data[0];
        setVerificationStatus(document.status);
      } else {
        setVerificationStatus("not_submitted");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await axios.post(
        "https://findcreators-537037621947.asia-south2.run.app/api/kyc",
        formData,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Documents submitted successfully");
      setVerificationStatus("pending");
    } catch (error) {
      toast.error("Failed to submit documents");
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4">
        <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Company Verification</h2>
            {verificationStatus === "pending" ? (
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock size={14} />
                Under Review
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <AlertCircle size={14} />
                Not Verified
              </span>
            )}
          </div>

          {verificationStatus === "pending" ? (
            <p className="text-sm text-gray-600">
              Your documents are under review. We'll notify you once the
              verification is complete.
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-gray-600">
                Get verified to unlock all platform features and build trust
                with creators.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap text-sm"
              >
                <Shield className="w-4 h-4" />
                Start Verification
              </button>
            </div>
          )}
        </div>
      </div>

      <KYCModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default KYCVerification;
