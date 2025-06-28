import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { generateEsewaPaymentForm } from '../../services/payment/esewaService';

const EsewaScreen: React.FC = () => {
  const { price } = useLocalSearchParams<{ price: string }>();
  const [htmlForm, setHtmlForm] = useState<string>('');

  useEffect(() => {
    async function generateForm() {
      const { htmlForm } = await generateEsewaPaymentForm(Number(price));
      setHtmlForm(htmlForm);
    }
    generateForm();
  }, [price]);

  if (!htmlForm) return null;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlForm }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/90.0.4430.91 Mobile Safari/537.36"
      startInLoadingState={true}
    />
  );
};

export default EsewaScreen;
