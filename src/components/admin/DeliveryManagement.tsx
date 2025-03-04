
import React, { useState, useEffect } from 'react';
import { DeliveryStep, DeliveryDriverInfo, DeliverySystemConfig } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, UserPlus, Save, Truck } from 'lucide-react';

// Function to get tracking configuration from localStorage
const getTrackingConfig = (): DeliverySystemConfig => {
  const defaultSteps: DeliveryStep[] = [
    { key: 'pending', label: 'Order Placed', description: 'Your order has been received', order: 1 },
    { key: 'confirmed', label: 'Driver Assigned', description: 'A driver has been assigned to your order', order: 2 },
    { key: 'en-route', label: 'On The Way', description: 'Your driver is en route to your location', order: 3 },
    { key: 'arriving', label: 'Almost There', description: 'Your driver is arriving soon', order: 4 },
    { key: 'delivered', label: 'Delivered', description: 'Your fuel has been delivered', order: 5 }
  ];

  try {
    const stored = localStorage.getItem('fuelninja-tracking-config');
    if (stored) {
      const parsed = JSON.parse(stored) as DeliverySystemConfig;
      // Make sure we always have the required keys
      if (!parsed.steps || !Array.isArray(parsed.steps)) {
        parsed.steps = defaultSteps;
      }
      if (!parsed.activeDrivers || !Array.isArray(parsed.activeDrivers)) {
        parsed.activeDrivers = [];
      }
      return parsed;
    }
  } catch (error) {
    console.error('Error parsing tracking config:', error);
  }

  // Return default if nothing found or error
  return { 
    steps: defaultSteps,
    activeDrivers: []
  };
};

// Function to save tracking configuration to localStorage
const saveTrackingConfig = (config: DeliverySystemConfig): boolean => {
  try {
    localStorage.setItem('fuelninja-tracking-config', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving tracking config:', error);
    return false;
  }
};

const DeliveryManagement: React.FC = () => {
  const [trackingConfig, setTrackingConfig] = useState<DeliverySystemConfig>(getTrackingConfig());
  const [activeTab, setActiveTab] = useState<string>("steps");
  const [newDriverName, setNewDriverName] = useState<string>('');

  // Save configuration when it changes
  const handleSaveConfig = () => {
    if (saveTrackingConfig(trackingConfig)) {
      toast.success('Delivery system configuration saved successfully');
    } else {
      toast.error('Failed to save delivery system configuration');
    }
  };

  // Function to handle step drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = [...trackingConfig.steps];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setTrackingConfig({
      ...trackingConfig,
      steps: updatedItems
    });
  };

  // Update a step's property
  const updateStep = (index: number, field: string, value: string) => {
    const updatedSteps = [...trackingConfig.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value
    };
    
    setTrackingConfig({
      ...trackingConfig,
      steps: updatedSteps
    });
  };

  // Add a new driver
  const addDriver = () => {
    if (!newDriverName.trim()) {
      toast.error('Driver name is required');
      return;
    }

    const newDriver: DeliveryDriverInfo = {
      name: newDriverName,
      eta: '15-20 minutes'
    };

    setTrackingConfig({
      ...trackingConfig,
      activeDrivers: [...trackingConfig.activeDrivers, newDriver]
    });
    
    setNewDriverName('');
    toast.success('Driver added successfully');
  };

  // Update driver information
  const updateDriver = (index: number, field: string, value: string) => {
    const updatedDrivers = [...trackingConfig.activeDrivers];
    updatedDrivers[index] = {
      ...updatedDrivers[index],
      [field]: value
    };
    
    setTrackingConfig({
      ...trackingConfig,
      activeDrivers: updatedDrivers
    });
  };

  // Remove a driver
  const removeDriver = (index: number) => {
    const updatedDrivers = [...trackingConfig.activeDrivers];
    updatedDrivers.splice(index, 1);
    
    setTrackingConfig({
      ...trackingConfig,
      activeDrivers: updatedDrivers
    });
    
    toast.success('Driver removed');
  };

  // Auto-save configuration when component unmounts
  useEffect(() => {
    return () => {
      saveTrackingConfig(trackingConfig);
    };
  }, [trackingConfig]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Delivery System Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="steps" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="steps">Tracking Steps</TabsTrigger>
            <TabsTrigger value="drivers">Active Drivers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="steps">
            <div className="mb-4 text-sm text-gray-600">
              Drag and drop to reorder the delivery steps that customers see on the tracking page.
            </div>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="delivery-steps">
                {(provided) => (
                  <div 
                    className="space-y-3"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {trackingConfig.steps.map((step, index) => (
                      <Draggable key={step.key} draggableId={step.key} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center space-x-2 bg-white p-3 rounded-md border"
                          >
                            <div {...provided.dragHandleProps} className="cursor-move">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-navy-blue text-white flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                              <Input 
                                value={step.label} 
                                onChange={(e) => updateStep(index, 'label', e.target.value)}
                                placeholder="Step label"
                                className="flex-1"
                              />
                              <Input 
                                value={step.description} 
                                onChange={(e) => updateStep(index, 'description', e.target.value)}
                                placeholder="Step description"
                                className="flex-1"
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TabsContent>
          
          <TabsContent value="drivers">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New driver name"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addDriver}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Driver
                </Button>
              </div>
              
              {trackingConfig.activeDrivers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No active drivers added yet. Add a driver to assign to deliveries.
                </div>
              ) : (
                <div className="space-y-4">
                  {trackingConfig.activeDrivers.map((driver, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Driver #{index + 1}</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeDriver(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm text-gray-500">Name</label>
                            <Input 
                              value={driver.name} 
                              onChange={(e) => updateDriver(index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-500">Phone</label>
                            <Input 
                              value={driver.phone || ''} 
                              onChange={(e) => updateDriver(index, 'phone', e.target.value)}
                              placeholder="Optional"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-500">Vehicle Model</label>
                            <Input 
                              value={driver.vehicleModel || ''} 
                              onChange={(e) => updateDriver(index, 'vehicleModel', e.target.value)}
                              placeholder="Optional"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-500">Vehicle Color</label>
                            <Input 
                              value={driver.vehicleColor || ''} 
                              onChange={(e) => updateDriver(index, 'vehicleColor', e.target.value)}
                              placeholder="Optional"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-500">License Plate</label>
                            <Input 
                              value={driver.licensePlate || ''} 
                              onChange={(e) => updateDriver(index, 'licensePlate', e.target.value)}
                              placeholder="Optional"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-500">Default ETA</label>
                            <Input 
                              value={driver.eta || ''} 
                              onChange={(e) => updateDriver(index, 'eta', e.target.value)}
                              placeholder="e.g. 15-20 minutes"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveConfig}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryManagement;
