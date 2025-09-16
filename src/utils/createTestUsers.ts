
import { supabase } from '@/integrations/supabase/client';

export const createTestUsers = async () => {
  const testUsers = [
    {
      email: 'admin.demo@gmail.com',
      password: 'password123',
      role: 'admin',
      name: 'ผู้ดูแลระบบ'
    },
    {
      email: 'employer.demo@gmail.com',
      password: 'password123',
      role: 'employer',
      name: 'บริษัทตัวอย่าง'
    },
    {
      email: 'applicant.demo@gmail.com',
      password: 'password123',
      role: 'applicant',
      name: 'ผู้สมัครงาน ตัวอย่าง'
    }
  ];

  console.log('Creating test users...');

  for (const user of testUsers) {
    try {
      console.log(`Processing user: ${user.email}`);
      
      // Try to sign in first to check if user exists
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      if (!loginError) {
        console.log(`User ${user.email} already exists`);
        await supabase.auth.signOut();
        continue;
      }

      // Create new user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            role: user.role,
            phone: '',
            address: ''
          }
        }
      });

      if (signUpError) {
        console.error(`Error creating user ${user.email}:`, signUpError);
        continue;
      }

      if (signUpData.user) {
        console.log(`User ${user.email} created successfully`);
        
        // Create profile
        await supabase.from('profiles').insert({
          id: signUpData.user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: '',
          address: ''
        });

        // Create role-specific profile
        if (user.role === 'employer') {
          await supabase.from('employers').insert({
            user_id: signUpData.user.id,
            business_name: user.name,
            contact_person: user.name,
            email: user.email,
            phone: '',
            address: '',
            description: 'บริษัททดสอบ',
            is_verified: true
          });
        } else if (user.role === 'applicant') {
          await supabase.from('applicants').insert({
            user_id: signUpData.user.id,
            first_name: user.name.split(' ')[0] || 'ชื่อ',
            last_name: user.name.split(' ')[1] || 'นามสกุล',
            email: user.email,
            phone: '',
            address: '',
            is_active: true
          });
        }
        
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
    }
  }

  console.log('Test user creation completed');
};

export const loginWithTestAccount = async (role: 'admin' | 'employer' | 'applicant') => {
  const testAccounts = {
    admin: { email: 'admin.demo@gmail.com', password: 'password123', name: 'ผู้ดูแลระบบ' },
    employer: { email: 'employer.demo@gmail.com', password: 'password123', name: 'บริษัทตัวอย่าง' },
    applicant: { email: 'applicant.demo@gmail.com', password: 'password123', name: 'ผู้สมัครงาน ตัวอย่าง' }
  };

  const account = testAccounts[role];
  
  try {
    console.log(`Attempting to login with ${account.email}`);
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: account.password,
    });

    if (!loginError && loginData.user) {
      console.log(`Login successful for ${account.email}`);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', loginData.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Create profile if it doesn't exist
        console.log(`Creating profile for ${account.email}`);
        
        await supabase.from('profiles').insert({
          id: loginData.user.id,
          name: account.name,
          email: account.email,
          role: role,
          phone: '',
          address: ''
        });

        // Create role-specific profile
        if (role === 'employer') {
          await supabase.from('employers').insert({
            user_id: loginData.user.id,
            business_name: account.name,
            contact_person: account.name,
            email: account.email,
            phone: '',
            address: '',
            description: 'บริษัททดสอบ',
            is_verified: true
          });
        } else if (role === 'applicant') {
          await supabase.from('applicants').insert({
            user_id: loginData.user.id,
            first_name: account.name.split(' ')[0] || 'ชื่อ',
            last_name: account.name.split(' ')[1] || 'นามสกุล',
            email: account.email,
            phone: '',
            address: '',
            is_active: true
          });
        }
      }
      
      return { success: true };
    }

    // If login failed, try to create account
    console.log(`Login failed, creating account for ${account.email}`);
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: {
          name: account.name,
          role: role,
          phone: '',
          address: ''
        }
      }
    });

    if (signUpError) {
      console.error(`Error creating account for ${account.email}:`, signUpError);
      return { success: false, error: signUpError };
    }

    if (signUpData.user) {
      console.log(`Account created for ${account.email}`);
      
      // Create profile
      await supabase.from('profiles').insert({
        id: signUpData.user.id,
        name: account.name,
        email: account.email,
        role: role,
        phone: '',
        address: ''
      });

      // Create role-specific profile
      if (role === 'employer') {
        await supabase.from('employers').insert({
          user_id: signUpData.user.id,
          business_name: account.name,
          contact_person: account.name,
          email: account.email,
          phone: '',
          address: '',
          description: 'บริษัททดสอบ',
          is_verified: true
        });
      } else if (role === 'applicant') {
        await supabase.from('applicants').insert({
          user_id: signUpData.user.id,
          first_name: account.name.split(' ')[0] || 'ชื่อ',
          last_name: account.name.split(' ')[1] || 'นามสกุล',
          email: account.email,
          phone: '',
          address: '',
          is_active: true
        });
      }
      
      return { success: true };
    }

    return { success: false, error: new Error('Unknown signup error') };
    
  } catch (error) {
    console.error(`Error in loginWithTestAccount for ${role}:`, error);
    return { success: false, error };
  }
};
