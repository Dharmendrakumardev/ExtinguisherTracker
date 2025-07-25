import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Search, Layers, Plus, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LocalStorageService } from "@/lib/storage";
import QRGenerator from "@/components/qr-generator";
import BatchQRModal from "@/components/batch-qr-modal";
import CameraScanner from "@/components/camera-scanner";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Batch generation state
  const [batchPrefix, setBatchPrefix] = useState('FE-');
  const [batchCount, setBatchCount] = useState(5);
  const [generatedBarcodes, setGeneratedBarcodes] = useState<string[]>([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Scanner state
  const [scanInput, setScanInput] = useState('');
  const [showCameraScanner, setShowCameraScanner] = useState(false);

  const navigateToStaticInfo = (barcode: string) => {
    setLocation(`/static-info/${encodeURIComponent(barcode)}`);
  };

  const navigateToMaintenanceLog = (barcode: string) => {
    setLocation(`/maintenance-log/${encodeURIComponent(barcode)}`);
  };

  const generateBatchQR = async () => {
    if (batchCount < 1 || batchCount > 200) {
      toast({
        title: "Error",
        description: "Batch count must be between 1 and 200",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    const barcodes = [];
    for (let i = 1; i <= batchCount; i++) {
      const paddedNumber = i.toString().padStart(3, '0');
      barcodes.push(`${batchPrefix}${paddedNumber}`);
    }
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setGeneratedBarcodes(barcodes);
    setShowBatchModal(true);
    setIsGenerating(false);
    
    toast({
      title: "Success",
      description: `Generated ${batchCount} QR codes successfully!`,
    });
  };

  const handleScan = () => {
    if (!scanInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a barcode to scan",
        variant: "destructive",
      });
      return;
    }

    processScanResult(scanInput);
  };

  const processScanResult = (barcode: string) => {
    const extinguisher = LocalStorageService.getExtinguisher(barcode);
    if (extinguisher) {
      navigateToMaintenanceLog(barcode);
      toast({
        title: "Success",
        description: "Existing extinguisher found!",
      });
    } else {
      navigateToStaticInfo(barcode);
      toast({
        title: "Info",
        description: "New extinguisher detected. Please enter details.",
      });
    }
  };

  const openCameraScanner = () => {
    setShowCameraScanner(true);
  };

  return (
    <div className="space-y-8">
      {/* Single QR Code Generation */}
      <QRGenerator onNavigateToStaticInfo={navigateToStaticInfo} />

      {/* Batch QR Code Generation */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Layers className="h-7 w-7 text-blue-600 mr-3" />
            Batch QR Code Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="batch-prefix">Prefix</Label>
              <Input
                id="batch-prefix"
                type="text"
                value={batchPrefix}
                onChange={(e) => setBatchPrefix(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="batch-count">Count (1-200)</Label>
              <Input
                id="batch-count"
                type="number"
                min="1"
                max="200"
                value={batchCount}
                onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                className="mt-2"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={generateBatchQR}
                disabled={isGenerating}
                className="w-full btn-primary"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Batch
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Preview: {batchPrefix}001, {batchPrefix}002, {batchPrefix}003...</p>
          </div>
        </CardContent>
      </Card>

      {/* Barcode Scanner */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Search className="h-7 w-7 text-blue-600 mr-3" />
            Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="scan-input">Enter Barcode Manually</Label>
                <Input
                  id="scan-input"
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="e.g., FE-001"
                  className="mt-2"
                />
                <Button
                  onClick={handleScan}
                  className="mt-4 w-full btn-primary"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Process Barcode
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <Camera className="h-16 w-16 mx-auto mb-4" />
                <p className="text-sm font-medium mb-3">Camera Scanner</p>
                <Button
                  onClick={openCameraScanner}
                  className="btn-primary"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Scan with Camera
                </Button>
                <p className="text-xs mt-3 text-gray-400">Use your device camera to scan QR codes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Modal */}
      <BatchQRModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        barcodes={generatedBarcodes}
        onNavigateToStaticInfo={navigateToStaticInfo}
      />

      {/* Camera Scanner Modal */}
      <CameraScanner
        isOpen={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onScanResult={processScanResult}
      />
    </div>
  );
}
