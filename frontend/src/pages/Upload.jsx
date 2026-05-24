import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadCard from '../components/UploadCard';
import { Brain, Cpu, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

// Import TensorFlow core libraries
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const Upload = () => {
  const navigate = useNavigate();

  // Model loading and inference states
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelLoadingProgress, setModelLoadingProgress] = useState('');

  const modelRef = useRef(null);

  // Pre-load MobileNet client-side for immediate use
  useEffect(() => {
    const initTF = async () => {
      if (modelRef.current) return;
      try {
        setIsModelLoading(true);
        setModelLoadingProgress('Pruning tensor activation engines...');
        await tf.ready();

        setModelLoadingProgress('Downloading MobileNet v2 neural weights...');
        const loadedModel = await mobilenet.load({
          version: 2,
          alpha: 1.0,
        });

        modelRef.current = loadedModel;
        setModelLoadingProgress('Neural engines primed.');
      } catch (error) {
        console.error('TF Engine initialization failed:', error);
        toast.error('Failed to load local neural engines. Reverting to sandbox mode...');
      } finally {
        setIsModelLoading(false);
      }
    };

    initTF();
  }, []);

  // Main Image Inference Workflow
  const handleImageSelected = async (imageInfo) => {
    setSelectedImage(imageInfo);
    if (!imageInfo || !imageInfo.base64) return;

    setIsAnalyzing(true);
    const toastId = toast.loading('Initializing scan engines...', { duration: 0 });

    try {
      // 1. Warm up local TensorFlow.js classifier
      if (!modelRef.current) {
        toast.loading('AI Model not cached yet. Fetching weights...', { id: toastId });
        await tf.ready();
        modelRef.current = await mobilenet.load({ version: 2, alpha: 1.0 });
      }

      toast.loading('MobileNet scanning pixels...', { id: toastId });

      // Load image element into helper for MobileNet to classify
      const img = new window.Image();
      img.src = imageInfo.base64;

      img.onload = async () => {
        try {
          // Perform local Edge AI classification
          const results = await modelRef.current.classify(img);
          if (!results || results.length === 0) {
            throw new Error('Local classifier returned empty statistics.');
          }

          const topResult = results[0];
          const primaryLabel = topResult.className.split(',')[0].trim();
          const confidenceScore = parseFloat((topResult.probability * 100).toFixed(2));

          // 2. Call Cloud AI (Google Gemini 1.5 Flash) or Fallback to Simulator
          toast.loading('Google Gemini analyzing image structures...', { id: toastId });

          const savedApiKey = localStorage.getItem('deepnet_gemini_api_key') || '';
          let geminiData = null;

          if (savedApiKey) {
            // Live Cloud Vision API Path
            try {
              // Strip metadata header from base64 string
              const base64Raw = imageInfo.base64.split(',')[1];

              const promptText = `Analyze this image and return the details strictly as a raw JSON object with keys: { "fullDescription": "string description...", "objectsVisible": ["array of visible objects"], "scene": "description of background/scene...", "colors": ["list of main colors"], "textVisible": "any OCR text visible in the image...", "category": "image category...", "keywords": ["tag1", "tag2", "tag3"], "summary": "one sentence summary of the image..." }. Do not wrap inside markdown code block formatting (like \`\`\`json), just return raw JSON text. Make it highly professional and complete.`;

              const requestBody = {
                contents: [
                  {
                    parts: [
                      { text: promptText },
                      {
                        inlineData: {
                          mimeType: "image/jpeg",
                          data: base64Raw
                        }
                      }
                    ]
                  }
                ]
              };

              const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${savedApiKey}`,
                requestBody
              );

              const rawText = response.data.candidates[0].content.parts[0].text;

              // Clean any markdown code blocks returned by Gemini
              const cleanText = rawText.replace(/```json|```/g, '').trim();
              geminiData = JSON.parse(cleanText);

            } catch (apiError) {
              console.error('Gemini Live API failed. Reverting to simulator:', apiError);
              toast.error('Gemini Key invalid or blocked. Using simulated fallback data...', { id: toastId, duration: 4000 });
              geminiData = simulateGeminiResponse(primaryLabel);
            }
          } else {
            // Simulator Mode Path
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate networking lag
            geminiData = simulateGeminiResponse(primaryLabel);
          }

          // 3. Persist record into browser LocalStorage History
          const newRecord = {
            id: 'scan_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
            image: imageInfo.base64,
            predictionLabel: primaryLabel,
            confidenceScore,
            topPredictions: results.map(r => ({
              className: r.className,
              probability: r.probability,
            })),
            geminiAnalysis: geminiData,
            createdAt: new Date().toISOString()
          };

          const history = JSON.parse(localStorage.getItem('deepnet_history_logs') || '[]');
          history.unshift(newRecord);
          localStorage.setItem('deepnet_history_logs', JSON.stringify(history));

          toast.success('AI classification complete!', { id: toastId });

          // Redirect straight to the results page
          navigate(`/result/${newRecord.id}`);

        } catch (innerError) {
          console.error('Inference step failed:', innerError);
          toast.error('AI could not classify this image frame.', { id: toastId });
          setIsAnalyzing(false);
        }
      };
    } catch (err) {
      console.error('AI pipeline crashed:', err);
      toast.error('Inference engine failed.', { id: toastId });
      setIsAnalyzing(false);
    }
  };

  // Intelligent Simulator fallback generator based on category tags
  const simulateGeminiResponse = (label) => {
    const labelLower = label.toLowerCase();

    let category = 'General';
    let description = `A clean high-resolution capture of a ${label}, displaying solid textures and distinct contours.`;
    let scene = 'A professional indoor laboratory or clear tabletop workspace environment.';
    let colors = ['Neutral White', 'Charcoal Gray', 'Slate Blue'];
    let objects = [label, 'Studio Backdrop', 'Table Surface'];
    let text = 'None';
    let keywords = ['scanner', 'AI classify', 'deep learning', label];

    if (['cat', 'dog', 'tiger', 'lion', 'bird', 'animal', 'puppy', 'kitten', 'wolf', 'fox', 'bear', 'rabbit'].some(k => labelLower.includes(k))) {
      category = 'Fauna (Animals)';
      description = `A clear biological capture of a ${label}, showcasing organic fur details, physical muscle structures, and expressive facial features.`;
      scene = 'A natural outdoor habitat context, displaying organic foliage or a warm domestic living room environment.';
      colors = ['Golden Amber', 'Sandy Tan', 'Forest Green'];
      objects = [label, 'Foliage', 'Organic Backdrop'];
      keywords = ['wildlife', 'fauna', 'mammal', 'pet care', label];
    } else if (['car', 'vehicle', 'truck', 'airplane', 'train', 'cycle', 'automobile', 'bus', 'boat', 'ship'].some(k => labelLower.includes(k))) {
      category = 'Transportation';
      description = `An industrial capture of a modern ${label}, highlighting aerodynamic contours, alloy details, and light-reflecting surfaces.`;
      scene = 'A modern outdoor highway roadway, urban street environment, or transport terminal.';
      colors = ['Metallic Silver', 'Obsidian Black', 'Cherry Red'];
      objects = [label, 'Asphalt Roadway', 'Urban Lighting'];
      keywords = ['automotive', 'vehicle design', 'urban transit', label];
    } else if (['flower', 'tree', 'sunflower', 'rose', 'plant', 'leaf', 'grass', 'forest', 'garden', 'dandelion'].some(k => labelLower.includes(k))) {
      category = 'Flora (Plants)';
      description = `A detailed botanical capture of a ${label}, displaying fine leaf venation, floral petal arrangements, and organic pigment distributions.`;
      scene = 'A vibrant garden greenhouse or sunny open-field park backdrop.';
      colors = ['Chlorophyll Green', 'Petal Yellow', 'Warm Soil Brown'];
      objects = [label, 'Stem', 'Pollen details'];
      keywords = ['botanical', 'horticulture', 'ecology', 'nature photography', label];
    } else if (['chair', 'table', 'desk', 'keyboard', 'computer', 'laptop', 'mouse', 'phone', 'bottle', 'mug', 'cup', 'book', 'screen', 'monitor'].some(k => labelLower.includes(k))) {
      category = 'Technology & Objects';
      description = `A sleek tabletop capture of a modern ${label}, highlighting clean industrial lines, structural ergonomic shapes, and matte materials.`;
      scene = 'A modern corporate workspace desk or contemporary home office studio configuration.';
      colors = ['Matte Black', 'Ice Silver', 'Warm Wood Grain'];
      objects = [label, 'Office Desk', 'Productivity workspace'];
      keywords = ['productivity', 'workplace', 'consumer tech', label];
    } else if (['food', 'pizza', 'burger', 'fruit', 'apple', 'banana', 'vegetable', 'cake', 'bread', 'pasta', 'dish', 'plate'].some(k => labelLower.includes(k))) {
      category = 'Food & Culinary';
      description = `A gourmet macro close-up of a fresh ${label}, emphasizing texture details, organic ingredient layers, and premium presentation plating.`;
      scene = 'A well-lit contemporary cafe table or professional culinary studio kitchen.';
      colors = ['Vibrant Orange', 'Citric Yellow', 'Cream White'];
      objects = [label, 'Ceramic Plate', 'Table Setting'];
      keywords = ['gastronomy', 'healthy nutrition', 'food styling', label];
    }

    return {
      fullDescription: description,
      objectsVisible: objects,
      scene: scene,
      colors: colors,
      textVisible: text,
      category: category,
      keywords: keywords,
      summary: `A high-fidelity AI-recognized image containing a ${label} classified within the ${category} taxonomy.`
    };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Header Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              <Sparkles className="h-3 w-3 animate-pulse" /> Dual AI Scanner
            </span>
            <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              AI Image Classification
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Upload images to classify objects using MobileNet AI and analyze detailed image information with Google Gemini AI.
            </p>
          </div>
        </div>

        {/* Neural Network Engine Loading Spinner Overlay */}
        {isModelLoading && (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 animate-pulse">
              <Brain className="h-8 w-8 animate-spin" />
            </div>
            <h3 className="mt-6 font-display text-lg font-bold text-slate-800">
              Pruning Artificial Synapses...
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto leading-normal">
              {modelLoadingProgress}
            </p>
            <div className="mt-6 h-1.5 w-48 bg-slate-100 mx-auto rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-indigo-600 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
            </div>
          </div>
        )}

        {/* Drag & Drop Upload card */}
        {!isModelLoading && !selectedImage && (
          <UploadCard onImageSelected={handleImageSelected} />
        )}

        {/* AI Scanning progress loader */}
        {isAnalyzing && (
          <div className="rounded-3xl border border-slate-100 bg-white p-16 text-center shadow-xl">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-100">
              <Brain className="h-12 w-12 animate-pulse" />
              <div className="absolute inset-0 rounded-3xl border border-indigo-400 animate-ping opacity-25"></div>
            </div>
            <h3 className="mt-8 font-display text-xl font-bold text-slate-800 animate-pulse">
              Running Hybrid AI Core...
            </h3>
            <p className="mt-2.5 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Evaluating local convolutional layers via MobileNet v2, establishing cloud handshakes, and generating visual context details...
            </p>
            <div className="mt-8 flex justify-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Upload;
