import React, { useEffect, useState } from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
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

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    console.log('Navigated to:', navState.url);
  };

  if (!htmlForm) return null;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlForm }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/90.0.4430.91 Mobile Safari/537.36"
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState={true}
    />
  );
};

export default EsewaScreen;
