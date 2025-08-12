import { NextRequest, NextResponse } from 'next/server';
import { getSupportedPlatforms, validateLocation } from '@/lib/location-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const pincode = searchParams.get('pincode');
    
    if (!city || !pincode) {
      return NextResponse.json({
        error: 'Missing city or pincode',
        message: 'Please provide both city and pincode parameters'
      }, { status: 400 });
    }
    
    // Create a mock location object for validation
    const location = {
      city: city.trim(),
      pincode: pincode.trim()
    };
    
    if (!validateLocation(location)) {
      return NextResponse.json({
        error: 'Invalid location format',
        message: 'Please provide a valid city and pincode'
      }, { status: 400 });
    }
    
    // Get supported platforms for this location
    const supportedPlatforms = getSupportedPlatforms(location);
    
    // Categorize platforms
    const categorizedPlatforms = {
      groceries: supportedPlatforms.filter(p => 
        ['zepto', 'blinkit', 'bigbasket', 'instamart'].includes(p.toLowerCase())
      ),
      food: supportedPlatforms.filter(p => 
        ['zomato', 'swiggy', 'magicpin'].includes(p.toLowerCase())
      ),
      medicines: supportedPlatforms.filter(p => 
        ['1mg', 'apollo247', 'pharmeasy'].includes(p.toLowerCase())
      )
    };
    
    const response = {
      location: {
        city: location.city,
        pincode: location.pincode,
        formatted: `${location.city} (${location.pincode})`
      },
      platformAvailability: {
        total: supportedPlatforms.length,
        byCategory: categorizedPlatforms,
        all: supportedPlatforms
      },
      metadata: {
        timestamp: new Date().toISOString(),
        locationValid: true
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Location platforms API error:', error);
    return NextResponse.json({
      error: 'Failed to get platform availability',
      message: 'Unable to determine platform support for this location'
    }, { status: 500 });
  }
} 