import { useRef, useEffect, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X, Scan, Upload, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (barcode: string) => void;
}

export default function CameraScanner({ isOpen, onClose, onScanResult }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'camera' | 'file' | 'select'>('select');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && scanMode === 'camera' && videoRef.current) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen, scanMode]);

  const startScanner = async () => {
    if (!videoRef.current) return;

    try {
      setIsScanning(true);
      setError(null);

      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        setError("No camera found on this device");
        setIsScanning(false);
        return;
      }

      // Get available cameras
      const cameras = await QrScanner.listCameras(true);
      
      // Create scanner instance with better configuration
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScanResult(result.data);
          toast({
            title: "Success",
            description: `Scanned: ${result.data}`,
          });
          onClose();
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: cameras.length > 1 ? 'environment' : 'user', // Use back camera if available, otherwise front
          maxScansPerSecond: 5,
        }
      );

      await scannerRef.current.start();
      setIsScanning(true);
    } catch (err) {
      console.error('Scanner error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start camera';
      setError(errorMessage);
      setIsScanning(false);
      
      toast({
        title: "Camera Error",
        description: errorMessage + ". Try uploading an image instead.",
        variant: "destructive",
      });
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
    setError(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      
      // Scan QR code from uploaded image
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });
      
      onScanResult(result.data);
      toast({
        title: "Success",
        description: `Scanned from image: ${result.data}`,
      });
      onClose();
    } catch (err) {
      console.error('Image scan error:', err);
      toast({
        title: "Scan Failed",
        description: "No QR code found in the image. Please try another image.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    stopScanner();
    setScanMode('select');
    onClose();
  };

  const selectCamera = () => {
    setScanMode('camera');
  };

  const selectFile = () => {
    setScanMode('file');
    fileInputRef.current?.click();
  };

  const goBack = () => {
    stopScanner();
    setScanMode('select');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <Scan className="h-5 w-5 mr-2" />
              {scanMode === 'select' ? 'Scan QR Code' : 'Scanning...'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {scanMode === 'select' && (
            <div className="space-y-4">
              <div className="text-center text-gray-600 mb-6">
                <p className="text-sm">Choose how you want to scan the QR code:</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={selectCamera}
                  className="h-24 flex flex-col items-center justify-center space-y-2 btn-primary"
                >
                  <Camera className="h-8 w-8" />
                  <span className="text-sm">Camera</span>
                </Button>
                
                <Button
                  onClick={selectFile}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                >
                  <Image className="h-8 w-8" />
                  <span className="text-sm">Gallery</span>
                </Button>
              </div>
              
              <div className="text-center text-xs text-gray-500">
                <p>Camera works best in good lighting</p>
                <p>Gallery option works with saved QR code images</p>
              </div>
            </div>
          )}

          {scanMode === 'camera' && (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                />
                
                {!isScanning && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="text-center text-white">
                      <Scan className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                      <p className="text-sm">Starting camera...</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
                    <div className="text-center text-white p-4">
                      <X className="h-12 w-12 mx-auto mb-2 text-red-400" />
                      <p className="text-sm font-medium mb-2">Camera Error</p>
                      <p className="text-xs text-gray-300 mb-4">{error}</p>
                      <Button
                        onClick={selectFile}
                        size="sm"
                        variant="secondary"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Try Gallery Instead
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  onClick={goBack}
                  variant="outline"
                  size="sm"
                >
                  Back
                </Button>
                <div className="text-center text-sm text-gray-600">
                  <p>Position QR code in the center</p>
                </div>
              </div>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );
}