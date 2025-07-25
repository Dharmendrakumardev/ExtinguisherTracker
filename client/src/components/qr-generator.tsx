import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Mail, MessageCircle, Download, Plus, ArrowRight, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shareBarcode } from "@/lib/utils";

interface QRGeneratorProps {
  onNavigateToStaticInfo: (barcode: string) => void;
}

export default function QRGenerator({ onNavigateToStaticInfo }: QRGeneratorProps) {
  const [singleBarcode, setSingleBarcode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSingleQR = async () => {
    if (!singleBarcode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a barcode identifier",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsGenerating(false);
    
    toast({
      title: "Success",
      description: "QR Code generated successfully!",
    });
  };

  const handleShare = (method: 'email' | 'whatsapp' | 'copy' | 'download') => {
    if (!singleBarcode.trim()) {
      toast({
        title: "Error", 
        description: "Please generate a QR code first",
        variant: "destructive",
      });
      return;
    }

    const success = shareBarcode(singleBarcode, method);
    if (success && method === 'copy') {
      toast({
        title: "Success",
        description: "Barcode copied to clipboard!",
      });
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <QrCode className="h-7 w-7 text-blue-600 mr-3" />
          Single QR Code Generation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="barcode-input">Barcode Identifier</Label>
              <Input
                id="barcode-input"
                type="text"
                value={singleBarcode}
                onChange={(e) => setSingleBarcode(e.target.value)}
                placeholder="e.g., FE-001"
                className="mt-2"
              />
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={generateSingleQR}
                disabled={isGenerating}
                className="btn-primary"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate QR
                  </>
                )}
              </Button>
              <Button
                onClick={() => onNavigateToStaticInfo(singleBarcode)}
                disabled={!singleBarcode.trim()}
                variant="secondary"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Enter Details
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 w-full flex justify-center">
              {singleBarcode ? (
                <div className="qr-container">
                  <QRCode value={singleBarcode} size={200} />
                </div>
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-gray-400">
                  <QrCode className="h-16 w-16" />
                </div>
              )}
            </div>
            
            {singleBarcode && (
              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShare('copy')}
                  title="Copy"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShare('email')}
                  title="Email"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShare('whatsapp')}
                  title="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShare('download')}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
