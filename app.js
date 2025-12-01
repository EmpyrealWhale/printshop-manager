import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Settings, Moon, Sun, Save, X, Package, Briefcase, Wrench, ShoppingCart, TrendingUp, DollarSign, Calculator, Boxes, ChevronDown, ChevronUp } from 'lucide-react';

export default function BusinessManager() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    materials: [],
    profitMargin: 20
  });

  const [materialForm, setMaterialForm] = useState({
    title: '',
    unit: 'عدد',
    pricePerUnit: '',
    category: ''
  });

  const [equipmentForm, setEquipmentForm] = useState({
    title: '',
    brand: '',
    model: '',
    purchaseDate: '',
    purchasePrice: '',
    maintenanceSchedule: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedColor = localStorage.getItem('primaryColor') || '#3b82f6';
    setTheme(savedTheme);
    setPrimaryColor(savedColor);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
  }, [primaryColor]);

  const loadData = async () => {
    try {
      const savedProducts = localStorage.getItem('products');
      const savedServices = localStorage.getItem('services');
      const savedMaterials = localStorage.getItem('materials');
      const savedEquipment = localStorage.getItem('equipment');
      
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedServices) setServices(JSON.parse(savedServices));
      if (savedMaterials) setMaterials(JSON.parse(savedMaterials));
      if (savedEquipment) setEquipment(JSON.parse(savedEquipment));
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const saveProducts = (data) => {
    localStorage.setItem('products', JSON.stringify(data));
    setProducts(data);
  };

  const saveServices = (data) => {
    localStorage.setItem('services', JSON.stringify(data));
    setServices(data);
  };

  const saveMaterials = (data) => {
    localStorage.setItem('materials', JSON.stringify(data));
    setMaterials(data);
  };

  const saveEquipment = (data) => {
    localStorage.setItem('equipment', JSON.stringify(data));
    setEquipment(data);
  };

  const calculateProductCost = (productMaterials) => {
    return productMaterials.reduce((total, pm) => {
      const material = materials.find(m => m.id === pm.materialId);
      if (material) {
        return total + (parseFloat(material.pricePerUnit) * parseFloat(pm.quantity));
      }
      return total;
    }, 0);
  };

  const calculateProfit = (cost, price) => {
    const profit = parseFloat(price) - cost;
    const profitPercent = cost > 0 ? (profit / cost) * 100 : 0;
    return { profit, profitPercent };
  };

  const handleAddProduct = () => {
    if (!formData.title.trim()) return;
    
    const cost = calculateProductCost(formData.materials);
    const suggestedPrice = cost * (1 + formData.profitMargin / 100);
    
    const newProduct = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      materials: formData.materials,
      cost: cost,
      price: formData.price || suggestedPrice.toFixed(0),
      profitMargin: formData.profitMargin,
      createdAt: new Date().toISOString()
    };
    
    saveProducts([...products, newProduct]);
    resetForm();
    setShowModal(false);
  };

  const handleUpdateProduct = () => {
    if (!formData.title.trim()) return;
    
    const cost = calculateProductCost(formData.materials);
    
    const updatedProducts = products.map(item => 
      item.id === editingItem.id 
        ? { 
            ...item, 
            title: formData.title,
            description: formData.description,
            category: formData.category,
            materials: formData.materials,
            cost: cost,
            price: formData.price,
            profitMargin: formData.profitMargin,
            updatedAt: new Date().toISOString()
          }
        : item
    );
    
    saveProducts(updatedProducts);
    resetForm();
    setShowModal(false);
    setEditingItem(null);
  };

  const handleAddService = () => {
    if (!formData.title.trim()) return;
    
    const newService = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      createdAt: new Date().toISOString()
    };
    
    saveServices([...services, newService]);
    resetForm();
    setShowModal(false);
  };

  const handleUpdateService = () => {
    if (!formData.title.trim()) return;
    
    const updatedServices = services.map(item => 
      item.id === editingItem.id 
        ? { 
            ...item, 
            title: formData.title,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            updatedAt: new Date().toISOString()
          }
        : item
    );
    
    saveServices(updatedServices);
    resetForm();
    setShowModal(false);
    setEditingItem(null);
  };

  const handleAddMaterial = () => {
    if (!materialForm.title.trim()) return;
    
    const newMaterial = {
      id: Date.now(),
      title: materialForm.title,
      unit: materialForm.unit,
      pricePerUnit: materialForm.pricePerUnit,
      category: materialForm.category,
      createdAt: new Date().toISOString()
    };
    
    saveMaterials([...materials, newMaterial]);
    setMaterialForm({ title: '', unit: 'عدد', pricePerUnit: '', category: '' });
    setShowModal(false);
  };

  const handleUpdateMaterial = () => {
    if (!materialForm.title.trim()) return;
    
    const updatedMaterials = materials.map(item => 
      item.id === editingItem.id 
        ? { 
            ...item, 
            ...materialForm,
            updatedAt: new Date().toISOString()
          }
        : item
    );
    
    saveMaterials(updatedMaterials);
    setMaterialForm({ title: '', unit: 'عدد', pricePerUnit: '', category: '' });
    setShowModal(false);
    setEditingItem(null);
  };

  const handleAddEquipment = () => {
    if (!equipmentForm.title.trim()) return;
    
    const newEquipment = {
      id: Date.now(),
      ...equipmentForm,
      createdAt: new Date().toISOString()
    };
    
    saveEquipment([...equipment, newEquipment]);
    setEquipmentForm({ title: '', brand: '', model: '', purchaseDate: '', purchasePrice: '', maintenanceSchedule: '', notes: '' });
    setShowModal(false);
  };

  const handleUpdateEquipment = () => {
    if (!equipmentForm.title.trim()) return;
    
    const updatedEquipment = equipment.map(item => 
      item.id === editingItem.id 
        ? { 
            ...item, 
            ...equipmentForm,
            updatedAt: new Date().toISOString()
          }
        : item
    );
    
    saveEquipment(updatedEquipment);
    setEquipmentForm({ title: '', brand: '', model: '', purchaseDate: '', purchasePrice: '', maintenanceSchedule: '', notes: '' });
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id, type) => {
    if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
      if (type === 'product') saveProducts(products.filter(item => item.id !== id));
      if (type === 'service') saveServices(services.filter(item => item.id !== id));
      if (type === 'material') saveMaterials(materials.filter(item => item.id !== id));
      if (type === 'equipment') saveEquipment(equipment.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    if (type === 'product') {
      setFormData({
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        materials: item.materials || [],
        profitMargin: item.profitMargin || 20
      });
    } else if (type === 'service') {
      setFormData({
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        materials: [],
        profitMargin: 20
      });
    } else if (type === 'material') {
      setMaterialForm({
        title: item.title,
        unit: item.unit,
        pricePerUnit: item.pricePerUnit,
        category: item.category
      });
    } else if (type === 'equipment') {
      setEquipmentForm({
        title: item.title,
        brand: item.brand || '',
        model: item.model || '',
        purchaseDate: item.purchaseDate || '',
        purchasePrice: item.purchasePrice || '',
        maintenanceSchedule: item.maintenanceSchedule || '',
        notes: item.notes || ''
      });
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      materials: [],
      profitMargin: 20
    });
    setEditingItem(null);
  };

  const addMaterialToProduct = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { materialId: '', quantity: 1 }]
    });
  };

  const updateProductMaterial = (index, field, value) => {
    const updated = [...formData.materials];
    updated[index][field] = value;
    setFormData({ ...formData, materials: updated });
  };

  const removeProductMaterial = (index) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index)
    });
  };

  const saveSettings = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('primaryColor', primaryColor);
    setShowSettings(false);
  };

  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';

  const currentCost = activeTab === 'products' ? calculateProductCost(formData.materials) : 0;
  const suggestedPrice = currentCost * (1 + formData.profitMargin / 100);

  if (loading) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-300`} dir="rtl">
      {/* Header */}
      <header className={`${cardBg} border-b ${borderClass} sticky top-0 z-40 backdrop-blur-lg bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">سیستم مدیریت کسب‌وکار</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowModal(true); resetForm(); }}
                className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="w-5 h-5" />
                افزودن
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className={`p-2 rounded-lg ${inputBg} hover:opacity-80 transition-all`}
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg ${inputBg} hover:opacity-80 transition-all`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'products', label: 'محصولات', icon: Package, count: products.length },
              { id: 'services', label: 'خدمات', icon: Briefcase, count: services.length },
              { id: 'materials', label: 'مواد اولیه', icon: Boxes, count: materials.length },
              { id: 'equipment', label: 'تجهیزات', icon: Wrench, count: equipment.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'text-white shadow-lg' : inputBg
                }`}
                style={activeTab === tab.id ? { backgroundColor: primaryColor } : {}}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white bg-opacity-20' : 'bg-gray-600 bg-opacity-30'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'products' && (
          <ProductsSection 
            products={products} 
            materials={materials}
            onEdit={(item) => handleEdit(item, 'product')}
            onDelete={(id) => handleDelete(id, 'product')}
            expandedProduct={expandedProduct}
            setExpandedProduct={setExpandedProduct}
            theme={theme}
            primaryColor={primaryColor}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderClass={borderClass}
            inputBg={inputBg}
            textClass={textClass}
          />
        )}

        {activeTab === 'services' && (
          <ServicesSection 
            services={services}
            onEdit={(item) => handleEdit(item, 'service')}
            onDelete={(id) => handleDelete(id, 'service')}
            theme={theme}
            primaryColor={primaryColor}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderClass={borderClass}
            inputBg={inputBg}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsSection 
            materials={materials}
            onEdit={(item) => handleEdit(item, 'material')}
            onDelete={(id) => handleDelete(id, 'material')}
            theme={theme}
            primaryColor={primaryColor}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderClass={borderClass}
            inputBg={inputBg}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentSection 
            equipment={equipment}
            onEdit={(item) => handleEdit(item, 'equipment')}
            onDelete={(id) => handleDelete(id, 'equipment')}
            theme={theme}
            primaryColor={primaryColor}
            cardBg={cardBg}
            textSecondary={textSecondary}
            borderClass={borderClass}
            inputBg={inputBg}
          />
        )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`${cardBg} rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingItem ? 'ویرایش' : 'افزودن'} {
                  activeTab === 'products' ? 'محصول' :
                  activeTab === 'services' ? 'خدمت' :
                  activeTab === 'materials' ? 'ماده اولیه' :
                  'تجهیزات'
                }
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className={`p-2 rounded-lg ${inputBg} hover:opacity-80`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {(activeTab === 'products' || activeTab === 'services') && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">عنوان *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2`}
                    placeholder="عنوان را وارد کنید"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">دسته‌بندی</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2`}
                    placeholder="دسته‌بندی"
                  />
                </div>

                {activeTab === 'products' && (
                  <>
                    <div className={`${inputBg} rounded-lg p-4 border ${borderClass}`}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium">مواد اولیه مورد نیاز</label>
                        <button
                          onClick={addMaterialToProduct}
                          className="px-3 py-1 rounded-lg text-white text-sm font-medium transition-all hover:scale-105"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {formData.materials.length === 0 ? (
                        <p className={`${textSecondary} text-sm text-center py-4`}>
                          هنوز ماده اولیه‌ای اضافه نشده
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {formData.materials.map((pm, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <select
                                value={pm.materialId}
                                onChange={(e) => updateProductMaterial(index, 'materialId', e.target.value)}
                                className={`flex-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-
