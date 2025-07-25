import { useRef, useEffect, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (barcode: string) => void;
}

export default function CameraScanner({ isOpen, onClose, onScanResult }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && videoRef.current) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

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

      // Create scanner instance
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
          preferredCamera: 'environment' // Use back camera on mobile
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
        description: errorMessage,
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

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Scan Barcode
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
          <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            {!isScanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                <div className="text-center text-white">
                  <Scan className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm">Initializing camera...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
                <div className="text-center text-white p-4">
                  <X className="h-12 w-12 mx-auto mb-2 text-red-400" />
                  <p className="text-sm font-medium mb-2">Camera Error</p>
                  <p className="text-xs text-gray-300">{error}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>Position the QR code within the camera view</p>
            <p className="text-xs mt-1">Make sure the code is well-lit and in focus</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}