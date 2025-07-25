import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Barcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LocalStorageService } from "@/lib/storage";
import { FireExtinguisherWithLogs } from "@shared/schema";
import { validateField, validateDate, generateUUID } from "@/lib/utils";

export default function StaticInfo() {
  const params = useParams<{ barcode: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const barcode = decodeURIComponent(params.barcode || '');
  
  const [formData, setFormData] = useState({
    extinguisherNo: '',
    location: '',
    dateOfTesting: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const navigateHome = () => {
    setLocation('/');
  };

  const navigateToMaintenanceLog = (barcode: string) => {
    setLocation(`/maintenance-log/${encodeURIComponent(barcode)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const extinguisherNoError = validateField(formData.extinguisherNo, 'Fire Extinguisher No');
    const locationError = validateField(formData.location, 'Location');
    const dateError = validateDate(formData.dateOfTesting, 'Date of Testing');

    if (extinguisherNoError || locationError || dateError) {
      toast({
        title: "Validation Error",
        description: extinguisherNoError || locationError || dateError || "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const extinguisherData: FireExtinguisherWithLogs = {
      id: generateUUID(),
      barcode,
      extinguisherNo: formData.extinguisherNo.trim(),
      location: formData.location.trim(),
      dateOfTesting: new Date(formData.dateOfTesting),
      createdAt: new Date(),
      maintenanceLogs: []
    };

    LocalStorageService.saveExtinguisher(barcode, extinguisherData);
    setIsSubmitting(false);
    
    toast({
      title: "Success",
      description: "Fire extinguisher registered successfully!",
    });
    
    navigateToMaintenanceLog(barcode);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Fire Extinguisher Registration
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateHome}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Barcode className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-blue-800">
                Barcode: {barcode}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="extinguisher-no">Fire Extinguisher No. *</Label>
              <Input
                id="extinguisher-no"
                type="text"
                required
                value={formData.extinguisherNo}
                onChange={(e) => handleInputChange('extinguisherNo', e.target.value)}
                placeholder="e.g., EX-1001"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Main Office - Ground Floor"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="date-testing">Date of Testing *</Label>
              <Input
                id="date-testing"
                type="date"
                required
                value={formData.dateOfTesting}
                onChange={(e) => handleInputChange('dateOfTesting', e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex space-x-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={navigateHome}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save & Continue
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
