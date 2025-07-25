import { useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Edit } from "lucide-react";
import { shareBarcode } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BatchQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  barcodes: string[];
  onNavigateToStaticInfo: (barcode: string) => void;
}

interface BatchQRCardProps {
  barcode: string;
  onNavigateToStaticInfo: (barcode: string) => void;
}

function BatchQRCard({ barcode, onNavigateToStaticInfo }: BatchQRCardProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    shareBarcode(barcode, 'copy');
    toast({
      title: "Success",
      description: "Barcode copied to clipboard!",
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <div className="mb-2 flex justify-center">
        <QRCode value={barcode} size={120} />
      </div>
      <p className="text-sm font-medium text-gray-900 mb-3">{barcode}</p>
      <div className="flex justify-center space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onNavigateToStaticInfo(barcode)}
          title="Enter Details"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function BatchQRModal({ isOpen, onClose, barcodes, onNavigateToStaticInfo }: BatchQRModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Generated QR Codes ({barcodes.length})
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {barcodes.map((barcode, index) => (
              <BatchQRCard 
                key={index} 
                barcode={barcode} 
                onNavigateToStaticInfo={onNavigateToStaticInfo}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
