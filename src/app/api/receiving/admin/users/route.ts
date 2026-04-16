import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY 환경 변수가 없습니다. Vercel 환경 변수에 추가해 주세요.' },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
    store?: string;
  };

  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();
  const name = body.name?.trim();
  const role = body.role?.trim() || 'store_admin';
  const store = body.store?.trim() || '';

  if (!email || !password || !name) {
    return NextResponse.json({ error: '이름, 이메일, 비밀번호를 모두 입력해 주세요.' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: '비밀번호는 8자 이상이어야 합니다.' }, { status: 400 });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role,
      store,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      name,
      role,
      store,
      created_at: data.user.created_at,
    },
  });
}
