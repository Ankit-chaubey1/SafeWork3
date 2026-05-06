import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink],
  template: `
    <div class="login-page">

      <!-- LEFT PANEL -->
      <div class="login-left">

        <svg class="deco-grid" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>

        <div class="left-content">
          <div class="login-brand">
            <div class="brand-logo">
              <span class="logo-text">SW</span>
              <div class="logo-shine"></div>
            </div>
            <div class="brand-name">SafeWork</div>
          </div>

          <div class="headline-wrap">
            <div class="tag-pill">Enterprise Safety Platform</div>
            <h1 class="login-headline">Workplace Safety,<br><span class="headline-accent">Simplified.</span></h1>
          </div>

          <p class="login-desc">A unified platform for hazard reporting, safety inspections, compliance tracking, and workplace safety program management.</p>

          <div class="divider-line"></div>

          <div class="feature-list">
            <div class="feature-item" *ngFor="let f of features; let i = index" [style.--i]="i">
              <div class="feature-icon-wrap">
                <span class="feature-icon">{{ f.icon }}</span>
              </div>
              <span class="feature-text">{{ f.text }}</span>
            </div>
          </div>

          <div class="trust-badge">
            <span class="trust-dot"></span>
            <span class="trust-dot"></span>
            <span class="trust-dot"></span>
            <span class="trust-label">Organization purposes</span>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="login-right">
        <div class="right-bg-pattern"></div>

        <div class="login-card">
          <div class=""></div>

          <div class="card-header">
            <div class="card-logo-mini">SW</div>
            <div>
              <h2 class="login-title">Sign in to SafeWork</h2>
              <p class="login-sub" style="font-size:15px">Sign in with approved account credentials.</p>
            </div>
            <div class=""></div>
          </div>

          <div *ngIf="error()" class="alert alert-danger" style="margin-bottom:16px">
            <span class="alert-icon">⚠</span>
            <span>{{ error() }}</span>
          </div>

          <form (ngSubmit)="submit()" #loginForm="ngForm">
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">
                <span class="label-icon">✉</span>
                Email Address
              </label>
              <div class="input-wrap">
                <input type="email" name="email" [(ngModel)]="email" required class="form-control" placeholder="your@email.com" autocomplete="username" />
                <div class="input-focus-bar"></div>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:20px">
              <label class="form-label">
                <span class="label-icon">🔒</span>
                Password
              </label>
              <div class="input-wrap">
                <input type="password" name="password" [(ngModel)]="password" required class="form-control" placeholder="••••••••" autocomplete="current-password" />
                <div class="input-focus-bar"></div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:11px" [disabled]="loading()">
              <span class="btn-inner">
                <span class="btn-spinner" *ngIf="loading()"></span>
                <span>{{ loading() ? 'Signing in...' : 'Sign In' }}</span>
                <span class="btn-arrow" *ngIf="!loading()">→</span>
              </span>
              <div class="btn-shimmer"></div>
            </button>
          </form>

          <div class="form-footer">
            <div class="footer-divider">
              <span class="divider-text">or</span>
            </div>
            <a routerLink="/employee-register" class="register-link">
              <span>New employee? Register here</span>
              <span class="reg-arrow">↗</span>
            </a>
          </div>

          <div class="card-footer-badge">
            <span class="shield-icon"></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeUp    { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
    @keyframes slideInL  { from { opacity:0; transform:translateX(-40px) } to { opacity:1; transform:translateX(0) } }
    @keyframes slideInR  { from { opacity:0; transform:translateX(40px) }  to { opacity:1; transform:translateX(0) } }
    @keyframes popIn     { 0%{opacity:0;transform:scale(.5) rotate(-12deg)} 70%{transform:scale(1.08) rotate(3deg)} 100%{opacity:1;transform:scale(1) rotate(0)} }
    @keyframes floatA    { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-22px) scale(1.05)} }
    @keyframes floatB    { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(18px) scale(.96)} }
    @keyframes floatC    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(14px,-14px)} }
    @keyframes spinRing  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes alertIn   { from{opacity:0;transform:translateY(-8px) scaleY(.92)} to{opacity:1;transform:translateY(0) scaleY(1)} }
    @keyframes featureIn { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
    @keyframes spinBtn   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes dotPulse  { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
    @keyframes logoShine { 0%{left:-60%;opacity:0} 40%{opacity:1} 100%{left:130%;opacity:0} }
    @keyframes tagSlide  { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }

    .login-page { display: flex; min-height: 100vh; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }

    /* LEFT */
    .login-left {
      flex: 1;
      background: linear-gradient(145deg, #1a3c5e 0%, #0d2035 55%, #071525 100%);
      color: #fff;
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
      animation: slideInL .8s cubic-bezier(.22,.68,0,1.2) both;
    }
    .deco-grid { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
    .orb { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; }
    .orb-1 { width:420px; height:420px; background:radial-gradient(circle,rgba(56,139,253,.18) 0%,transparent 65%); top:-120px; right:-100px; animation:floatA 8s ease-in-out infinite; }
    .orb-2 { width:280px; height:280px; background:radial-gradient(circle,rgba(93,200,184,.12) 0%,transparent 65%); bottom:80px; left:-60px; animation:floatB 10s ease-in-out infinite; }
    .orb-3 { width:160px; height:160px; background:radial-gradient(circle,rgba(255,200,80,.09) 0%,transparent 65%); top:55%; right:15%; animation:floatC 7s ease-in-out infinite; }
    .ring { position:absolute; border-radius:50%; border:1px solid rgba(255,255,255,.06); pointer-events:none; z-index:0; }
    .ring-1 { width:500px; height:500px; top:-160px; right:-160px; animation:spinRing 40s linear infinite; }
    .ring-2 { width:300px; height:300px; bottom:-80px; left:-80px; animation:spinRing 28s linear infinite reverse; }

    .left-content { position:relative; z-index:1; display:flex; flex-direction:column; gap:22px; }

    .login-brand { display:flex; align-items:center; gap:14px; animation:fadeUp .6s .1s both; }
    .brand-logo {
      width:48px; height:48px;
      background:linear-gradient(135deg,#fff 60%,#d4e9ff);
      color:#1a3c5e; border-radius:12px;
      display:flex; align-items:center; justify-content:center;
      font-size:15px; font-weight:800;
      box-shadow:0 4px 18px rgba(0,0,0,.25);
      position:relative; overflow:hidden;
      animation:popIn .7s .2s both;
      cursor:default;
      transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s ease;
    }
    .brand-logo:hover { transform:rotate(10deg) scale(1.15); box-shadow:0 8px 28px rgba(0,0,0,.35); }
    .logo-shine { position:absolute; top:-10px; left:-60px; width:40px; height:120%; background:rgba(255,255,255,.4); transform:skewX(-20deg); animation:logoShine 3s 1s ease-in-out infinite; }
    .brand-name { font-size:22px; font-weight:700; letter-spacing:-.01em; animation:fadeUp .6s .25s both; }

    .headline-wrap { animation:fadeUp .7s .3s both; }
    .tag-pill {
      display:inline-block;
      background:rgba(56,139,253,.2); border:1px solid rgba(56,139,253,.35);
      color:#93c5fd; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase;
      padding:4px 12px; border-radius:100px; margin-bottom:14px;
      animation:tagSlide .6s .35s both;
    }
    .login-headline { font-size:2.4rem; font-weight:800; line-height:1.12; letter-spacing:-.03em; margin:0; }
    .headline-accent {
      background:linear-gradient(90deg,#93c5fd 0%,#5de0e6 50%,#93c5fd 100%);
      background-size:200% auto;
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
      animation:shimmer 3.5s linear infinite;
    }

    .login-desc { font-size:14.5px; color:rgba(255,255,255,.65); max-width:380px; line-height:1.65; margin:0; animation:fadeUp .7s .42s both; }
    .divider-line { width:40px; height:3px; background:linear-gradient(90deg,#388bfd,#5de0e6); border-radius:99px; animation:fadeUp .6s .48s both; }

    .feature-list { display:flex; flex-direction:column; gap:10px; }
    .feature-item {
      display:flex; align-items:center; gap:12px;
      opacity:0;
      animation:featureIn .5s calc(.52s + var(--i,0) * .1s) cubic-bezier(.22,.68,0,1.2) forwards;
      cursor:default; transition:transform .25s ease;
    }
    .feature-item:hover { transform:translateX(6px); }
    .feature-icon-wrap {
      width:34px; height:34px;
      background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12);
      border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0;
      transition:background .25s,border-color .25s,transform .3s cubic-bezier(.34,1.56,.64,1);
    }
    .feature-item:hover .feature-icon-wrap { background:rgba(56,139,253,.2); border-color:rgba(56,139,253,.4); transform:scale(1.15) rotate(-5deg); }
    .feature-icon { font-size:16px; }
    .feature-text { font-size:13.5px; color:rgba(255,255,255,.8); transition:color .2s; }
    .feature-item:hover .feature-text { color:#fff; }

    .trust-badge { display:flex; align-items:center; gap:8px; opacity:0; animation:fadeUp .6s 1.1s both; }
    .trust-dot { width:7px; height:7px; background:#5de0e6; border-radius:50%; animation:dotPulse 1.6s ease-in-out infinite; }
    .trust-dot:nth-child(2) { animation-delay:.3s; background:#93c5fd; }
    .trust-dot:nth-child(3) { animation-delay:.6s; background:#388bfd; }
    .trust-label { font-size:12px; color:rgba(255,255,255,.5); font-weight:500; }

    /* RIGHT */
    .login-right {
      width:500px; background:#f0f4f8;
      display:flex; align-items:center; justify-content:center;
      padding:32px 24px; position:relative; overflow:hidden;
      animation:slideInR .8s .1s cubic-bezier(.22,.68,0,1.2) both;
    }
    .right-bg-pattern {
      position:absolute; inset:0;
      background-image:radial-gradient(circle,rgba(26,60,94,.07) 1.5px,transparent 1.5px);
      background-size:24px 24px; pointer-events:none;
    }

    .login-card {
      width:100%; max-width:400px;
      background:#fff; border-radius:20px;
      box-shadow:0 0 0 1px rgba(26,60,94,.08),0 8px 32px rgba(26,60,94,.10),0 32px 64px rgba(26,60,94,.06);
      overflow:hidden; position:relative; z-index:1;
      animation:fadeUp .7s .3s cubic-bezier(.22,.68,0,1.2) both;
      transition:box-shadow .3s ease,transform .3s ease;
    }
    .login-card:hover {
      box-shadow:0 0 0 1px rgba(26,60,94,.1),0 12px 40px rgba(26,60,94,.13),0 40px 80px rgba(26,60,94,.09);
      transform:translateY(-3px);
    }

    .card-accent-bar {
      height:4px;
      background:linear-gradient(90deg,#1a3c5e,#388bfd,#5de0e6,#388bfd,#1a3c5e);
      background-size:300% 100%;
      animation:shimmer 3s linear infinite;
    }

    .card-header { display:flex; align-items:center; gap:14px; padding:24px 28px 0; animation:fadeUp .6s .45s both; }
    .card-logo-mini {
      width:42px; height:42px;
      background:linear-gradient(135deg,#1a3c5e 0%,#2563a8 100%);
      color:#fff; border-radius:10px;
      display:flex; align-items:center; justify-content:center;
      font-size:13px; font-weight:800; flex-shrink:0;
      box-shadow:0 4px 12px rgba(26,60,94,.25);
      animation:popIn .7s .5s both;
    }
    .login-title { font-size:1.4rem; font-weight:800; margin:0 0 3px; color:#0d2035; letter-spacing:-.02em; }
    .login-sub { font-size:12.5px; color:red; margin:0; }

    form { padding:20px 28px 0; }

    .alert.alert-danger {
      margin:16px 28px 0;
      display:flex; align-items:center; gap:8px;
      background:#fff5f5; border:1px solid #fcd4d4; border-radius:10px;
      padding:10px 14px; font-size:13px; color:#c0392b;
      animation:alertIn .35s cubic-bezier(.22,.68,0,1.2) both;
    }
    .alert-icon { font-size:15px; }

    .form-label { display:flex; align-items:center; gap:6px; font-size:12.5px; font-weight:700; color:#334155; margin-bottom:6px; text-transform:uppercase; letter-spacing:.05em; transition:color .2s; }
    .label-icon { font-size:13px; }
    .form-group:focus-within .form-label { color:#1a3c5e; }

    .input-wrap { position:relative; }
    .input-focus-bar { position:absolute; bottom:0; left:50%; width:0; height:2px; background:linear-gradient(90deg,#388bfd,#5de0e6); border-radius:0 0 4px 4px; transition:width .3s ease,left .3s ease; }
    .form-group:focus-within .input-focus-bar { width:100%; left:0; }

    .form-control {
      width:100%; box-sizing:border-box;
      background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px;
      padding:10px 14px; font-size:14px; color:#0d2035;
      transition:border-color .25s,box-shadow .25s,background .2s,transform .2s; outline:none;
    }
    .form-control::placeholder { color:#94a3b8; }
    .form-control:hover:not(:focus) { border-color:#b0c4de; background:#f1f5f9; }
    .form-control:focus { border-color:#388bfd; background:#fff; box-shadow:0 0 0 4px rgba(56,139,253,.12); transform:translateY(-1px); }

    .form-group { animation:fadeUp .5s both; }
    .form-group:nth-of-type(1) { animation-delay:.58s; }
    .form-group:nth-of-type(2) { animation-delay:.68s; }

    .btn.btn-primary {
      position:relative; overflow:hidden;
      background:linear-gradient(135deg,#1a3c5e 0%,#2563a8 100%);
      border:none; border-radius:12px; color:#fff;
      font-size:15px; font-weight:700; cursor:pointer; letter-spacing:.01em;
      transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s ease,filter .2s;
      animation:fadeUp .6s .78s both;
    }
    .btn-inner { display:flex; align-items:center; justify-content:center; gap:8px; position:relative; z-index:1; }
    .btn-arrow { display:inline-block; transition:transform .25s cubic-bezier(.34,1.56,.64,1); }
    .btn.btn-primary:hover:not([disabled]) { transform:translateY(-2px) scale(1.015); box-shadow:0 10px 28px rgba(26,60,94,.35); filter:brightness(1.08); }
    .btn.btn-primary:hover:not([disabled]) .btn-arrow { transform:translateX(4px); }
    .btn.btn-primary:active:not([disabled]) { transform:translateY(0) scale(.98); transition-duration:.08s; }
    .btn.btn-primary[disabled] { opacity:.75; cursor:not-allowed; }
    .btn-shimmer { position:absolute; inset:0; background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.22) 50%,transparent 65%); background-size:300% 100%; opacity:0; transition:opacity .2s; }
    .btn.btn-primary:hover:not([disabled]) .btn-shimmer { opacity:1; animation:shimmer 1.4s linear infinite; }
    .btn-spinner { width:16px; height:16px; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spinBtn .7s linear infinite; flex-shrink:0; }

    .form-footer { padding:16px 28px 0; animation:fadeUp .6s .9s both; }
    .footer-divider { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
    .footer-divider::before,.footer-divider::after { content:''; flex:1; height:1px; background:#e2e8f0; }
    .divider-text { font-size:12px; color:#94a3b8; font-weight:500; }
    .register-link {
      display:flex; align-items:center; justify-content:center; gap:6px;
      font-size:13.5px; font-weight:600; color:#1a3c5e; text-decoration:none;
      background:#f0f7ff; border:1.5px solid #bdd8f8; border-radius:10px; padding:9px 16px;
      transition:background .2s,border-color .2s,transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .2s;
    }
    .register-link:hover { background:#dbeeff; border-color:#388bfd; transform:translateY(-2px); box-shadow:0 6px 18px rgba(56,139,253,.15); }
    .reg-arrow { font-size:15px; transition:transform .25s ease; }
    .register-link:hover .reg-arrow { transform:translate(2px,-2px); }

    .card-footer-badge { display:flex; align-items:center; justify-content:center; gap:6px; padding:14px 28px 22px; font-size:11.5px; color:#94a3b8; font-weight:500; animation:fadeUp .6s 1s both; }
    .shield-icon { font-size:13px; }

    @media (max-width: 900px) {
      .login-left { display: none; }
      .login-right { width: 100%; }
    }
  `],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  features = [
    { icon: '⚠', text: 'Hazard reporting & incident management' },
    { icon: '🔍', text: 'Safety inspections & compliance tracking' },
    { icon: '📋', text: 'Workplace safety program oversight' },
    { icon: '📊', text: 'Compliance audits & analytics' },
    { icon: '🔔', text: 'Real-time alerts & notifications' },
  ];

  async submit(): Promise<void> {
    this.error.set('');
    if (!this.email || !this.password) {
      this.error.set('Please enter your email and password.');
      return;
    }
    this.loading.set(true);
    const result = await this.auth.login(this.email, this.password);
    this.loading.set(false);
    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error.set(result.message);
    }
  }
}

// import { Component, signal, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { NgFor, NgIf } from '@angular/common';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, NgFor, NgIf, RouterLink],
//   template: `
//     <div class="login-page">
//       <div class="login-left">
//         <div class="login-brand">
//           <div class="brand-logo">SW</div>
//           <div class="brand-name">SafeWork</div>
//         </div>
//         <h1 class="login-headline">Workplace Safety,<br>Simplified.</h1>
//         <p class="login-desc">A unified platform for hazard reporting, safety inspections, compliance tracking, and workplace safety program management.</p>
//         <div class="feature-list">
//           <div class="feature-item" *ngFor="let f of features">
//             <span class="feature-icon">{{ f.icon }}</span>
//             <span>{{ f.text }}</span>
//           </div>
//         </div>
//       </div>

//       <div class="login-right">
//         <div class="login-card">
//           <h2 class="login-title">Sign in to SafeWork</h2>
//           <p class="login-sub" style="color:red">Sign in with approved account credentials.</p>

//           <div *ngIf="error()" class="alert alert-danger" style="margin-bottom:16px">
//             <span>⚠</span> {{ error() }}
//           </div>

//           <form (ngSubmit)="submit()" #loginForm="ngForm">
//             <div class="form-group" style="margin-bottom:14px">
//               <label class="form-label">Email Address</label>
//               <input type="email" name="email" [(ngModel)]="email" required class="form-control" placeholder="your@email.com" autocomplete="username" />
//             </div>
//             <div class="form-group" style="margin-bottom:20px">
//               <label class="form-label">Password</label>
//               <input type="password" name="password" [(ngModel)]="password" required class="form-control" placeholder="••••••••" autocomplete="current-password" />
//             </div>
//             <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:11px" [disabled]="loading()">
//               {{ loading() ? 'Signing in...' : 'Sign In' }}
//             </button>
//           </form>

//           <div style="margin-top:12px;text-align:center">
//             <a routerLink="/employee-register" style="font-size:13px;color:var(--primary);text-decoration:none">New employee? Register here</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     /* ─── Keyframes ─────────────────────────────────────────────── */
//     @keyframes fadeSlideUp {
//       from { opacity: 0; transform: translateY(28px); }
//       to   { opacity: 1; transform: translateY(0); }
//     }
//     @keyframes fadeSlideRight {
//       from { opacity: 0; transform: translateX(-32px); }
//       to   { opacity: 1; transform: translateX(0); }
//     }
//     @keyframes fadeSlideLeft {
//       from { opacity: 0; transform: translateX(32px); }
//       to   { opacity: 1; transform: translateX(0); }
//     }
//     @keyframes logoPopIn {
//       0%   { opacity: 0; transform: scale(0.6) rotate(-8deg); }
//       70%  { transform: scale(1.1) rotate(2deg); }
//       100% { opacity: 1; transform: scale(1) rotate(0deg); }
//     }
//     @keyframes shimmer {
//       0%   { background-position: -200% center; }
//       100% { background-position:  200% center; }
//     }
//     @keyframes pulseGlow {
//       0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); }
//       50%       { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
//     }
//     @keyframes floatOrb {
//       0%, 100% { transform: translateY(0) scale(1); }
//       50%       { transform: translateY(-18px) scale(1.04); }
//     }
//     @keyframes spinSlow {
//       from { transform: rotate(0deg); }
//       to   { transform: rotate(360deg); }
//     }
//     @keyframes alertSlideIn {
//       from { opacity: 0; transform: translateY(-10px) scaleY(0.9); }
//       to   { opacity: 1; transform: translateY(0) scaleY(1); }
//     }
//     @keyframes featureStagger {
//       from { opacity: 0; transform: translateX(-20px); }
//       to   { opacity: 1; transform: translateX(0); }
//     }
//     @keyframes borderRun {
//       0%   { background-position: 0% 50%; }
//       100% { background-position: 300% 50%; }
//     }

//     /* ─── Layout ─────────────────────────────────────────────────── */
//     .login-page {
//       display: flex;
//       min-height: 100vh;
//     }

//     /* ─── Left Panel ─────────────────────────────────────────────── */
//     .login-left {
//       flex: 1;
//       background: linear-gradient(145deg, #1a3c5e 0%, #0f2440 100%);
//       color: #fff;
//       padding: 48px;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       gap: 24px;
//       position: relative;
//       overflow: hidden;
//       animation: fadeSlideRight 0.7s cubic-bezier(.22,.68,0,1.2) both;
//     }

//     /* Animated background orbs */
//     .login-left::before {
//       content: '';
//       position: absolute;
//       width: 340px;
//       height: 340px;
//       border-radius: 50%;
//       background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
//       top: -80px;
//       right: -80px;
//       animation: floatOrb 7s ease-in-out infinite;
//       pointer-events: none;
//     }
//     .login-left::after {
//       content: '';
//       position: absolute;
//       width: 220px;
//       height: 220px;
//       border-radius: 50%;
//       background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
//       bottom: 60px;
//       left: -60px;
//       animation: floatOrb 9s ease-in-out infinite reverse;
//       pointer-events: none;
//     }

//     /* Brand */
//     .login-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       animation: fadeSlideUp 0.6s 0.1s cubic-bezier(.22,.68,0,1.2) both;
//     }
//     .brand-logo {
//       width: 44px;
//       height: 44px;
//       background: #fff;
//       color: #1a3c5e;
//       border-radius: 10px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 15px;
//       font-weight: 800;
//       animation: logoPopIn 0.7s 0.2s cubic-bezier(.22,.68,0,1.2) both;
//       transition: transform 0.3s ease, box-shadow 0.3s ease;
//     }
//     .brand-logo:hover {
//       transform: rotate(8deg) scale(1.12);
//       box-shadow: 0 6px 20px rgba(0,0,0,0.25);
//     }
//     .brand-name {
//       font-size: 20px;
//       font-weight: 700;
//       animation: fadeSlideUp 0.6s 0.25s both;
//     }

//     /* Headline */
//     .login-headline {
//       font-size: 2.25rem;
//       font-weight: 700;
//       line-height: 1.15;
//       letter-spacing: -.02em;
//       max-width: 400px;
//       animation: fadeSlideUp 0.7s 0.3s cubic-bezier(.22,.68,0,1.2) both;

//       /* shimmer on hover */
//       background: linear-gradient(90deg, #fff 30%, #93c5fd 50%, #fff 70%);
//       background-size: 200% auto;
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//       transition: background-position 0.5s ease;
//     }
//     .login-headline:hover {
//       animation: shimmer 1.8s linear infinite;
//     }

//     /* Desc */
//     .login-desc {
//       font-size: 15px;
//       color: rgba(255,255,255,.75);
//       max-width: 380px;
//       line-height: 1.6;
//       animation: fadeSlideUp 0.7s 0.42s cubic-bezier(.22,.68,0,1.2) both;
//     }

//     /* Feature list */
//     .feature-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       margin-top: 8px;
//     }
//     .feature-item {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       font-size: 14px;
//       color: rgba(255,255,255,.85);
//       opacity: 0;
//       animation: featureStagger 0.55s cubic-bezier(.22,.68,0,1.2) forwards;
//       transition: color 0.25s ease, transform 0.25s ease;
//     }
//     .feature-item:nth-child(1) { animation-delay: 0.50s; }
//     .feature-item:nth-child(2) { animation-delay: 0.62s; }
//     .feature-item:nth-child(3) { animation-delay: 0.74s; }
//     .feature-item:nth-child(4) { animation-delay: 0.86s; }
//     .feature-item:nth-child(5) { animation-delay: 0.98s; }
//     .feature-item:hover {
//       color: #fff;
//       transform: translateX(6px);
//     }

//     .feature-icon {
//       font-size: 18px;
//       width: 28px;
//       text-align: center;
//       transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
//     }
//     .feature-item:hover .feature-icon {
//       transform: scale(1.35) rotate(-5deg);
//     }

//     /* ─── Right Panel ────────────────────────────────────────────── */
//     .login-right {
//       width: 480px;
//       background: var(--bg);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       padding: 32px 24px;
//       animation: fadeSlideLeft 0.7s 0.15s cubic-bezier(.22,.68,0,1.2) both;
//     }

//     /* ─── Login Card ─────────────────────────────────────────────── */
//     .login-card {
//       width: 100%;
//       max-width: 400px;
//       animation: fadeSlideUp 0.65s 0.3s cubic-bezier(.22,.68,0,1.2) both;
//     }
//     .login-title {
//       font-size: 1.5rem;
//       font-weight: 700;
//       margin-bottom: 6px;
//       animation: fadeSlideUp 0.6s 0.4s both;
//     }
//     .login-sub {
//       font-size: 13px;
//       color: var(--text-muted);
//       margin-bottom: 24px;
//       animation: fadeSlideUp 0.6s 0.5s both;
//     }

//     /* Alert */
//     .alert.alert-danger {
//       animation: alertSlideIn 0.35s cubic-bezier(.22,.68,0,1.2) both;
//       transform-origin: top center;
//     }

//     /* Form fields */
//     .form-group {
//       animation: fadeSlideUp 0.5s both;
//     }
//     .form-group:nth-of-type(1) { animation-delay: 0.55s; }
//     .form-group:nth-of-type(2) { animation-delay: 0.65s; }

//     .form-label {
//       display: block;
//       margin-bottom: 6px;
//       font-size: 13px;
//       font-weight: 600;
//       transition: color 0.2s ease;
//     }
//     .form-group:focus-within .form-label {
//       color: var(--primary, #1a3c5e);
//     }

//     .form-control {
//       width: 100%;
//       box-sizing: border-box;
//       transition:
//         border-color 0.25s ease,
//         box-shadow 0.25s ease,
//         transform 0.2s ease;
//     }
//     .form-control:focus {
//       transform: translateY(-1px);
//       box-shadow: 0 4px 14px rgba(26,60,94,0.12);
//       outline: none;
//     }
//     .form-control:hover:not(:focus) {
//       border-color: rgba(26,60,94,0.4);
//     }

//     /* Submit button */
//     .btn.btn-primary {
//       position: relative;
//       overflow: hidden;
//       transition:
//         transform 0.2s cubic-bezier(.34,1.56,.64,1),
//         box-shadow 0.2s ease,
//         filter 0.2s ease;
//       animation: fadeSlideUp 0.6s 0.75s both;
//     }
//     .btn.btn-primary::after {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
//       background-size: 300% 100%;
//       opacity: 0;
//       transition: opacity 0.3s ease;
//     }
//     .btn.btn-primary:hover:not([disabled]) {
//       transform: translateY(-2px) scale(1.015);
//       box-shadow: 0 8px 24px rgba(26,60,94,0.28);
//       filter: brightness(1.08);
//     }
//     .btn.btn-primary:hover:not([disabled])::after {
//       opacity: 1;
//       animation: borderRun 1.2s linear infinite;
//     }
//     .btn.btn-primary:active:not([disabled]) {
//       transform: translateY(0) scale(0.98);
//       box-shadow: 0 2px 8px rgba(26,60,94,0.18);
//       transition-duration: 0.08s;
//     }
//     .btn.btn-primary[disabled] {
//       cursor: not-allowed;
//       opacity: 0.7;
//       animation: pulseGlow 1.6s ease-in-out infinite;
//     }

//     /* Register link */
//     div[style*="margin-top:12px"] {
//       animation: fadeSlideUp 0.6s 0.85s both;
//     }
//     div[style*="margin-top:12px"] a {
//       position: relative;
//       transition: color 0.2s ease;
//     }
//     div[style*="margin-top:12px"] a::after {
//       content: '';
//       position: absolute;
//       left: 0;
//       bottom: -2px;
//       width: 0;
//       height: 1.5px;
//       background: var(--primary, #1a3c5e);
//       transition: width 0.3s cubic-bezier(.22,.68,0,1.2);
//     }
//     div[style*="margin-top:12px"] a:hover::after {
//       width: 100%;
//     }

//     /* ─── Responsive ─────────────────────────────────────────────── */
//     @media (max-width: 900px) {
//       .login-left { display: none; }
//       .login-right { width: 100%; }
//     }
//   `],
// })
// export class LoginComponent {
//   private auth = inject(AuthService);
//   private router = inject(Router);

//   email = '';
//   password = '';
//   error = signal('');
//   loading = signal(false);

//   features = [
//     { icon: '⚠', text: 'Hazard reporting & incident management' },
//     { icon: '🔍', text: 'Safety inspections & compliance tracking' },
//     { icon: '📋', text: 'Workplace safety program oversight' },
//     { icon: '📊', text: 'Compliance audits & analytics' },
//     { icon: '🔔', text: 'Real-time alerts & notifications' },
//   ];

//   async submit(): Promise<void> {
//     this.error.set('');
//     if (!this.email || !this.password) {
//       this.error.set('Please enter your email and password.');
//       return;
//     }
//     this.loading.set(true);
//     const result = await this.auth.login(this.email, this.password);
//     this.loading.set(false);
//     if (result.success) {
//       this.router.navigate(['/dashboard']);
//     } else {
//       this.error.set(result.message);
//     }
//   }
// }

// import { Component, signal, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { NgFor, NgIf } from '@angular/common';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, NgFor, NgIf, RouterLink],
//   template: `
//     <div class="login-page">
//       <div class="login-left">
//         <div class="login-brand">
//           <div class="brand-logo">SW</div>
//           <div class="brand-name">SafeWork</div>
//         </div>
//         <h1 class="login-headline">Workplace Safety,<br>Simplified.</h1>
//         <p class="login-desc">A unified platform for hazard reporting, safety inspections, compliance tracking, and workplace safety program management.</p>
//         <div class="feature-list">
//           <div class="feature-item" *ngFor="let f of features">
//             <span class="feature-icon">{{ f.icon }}</span>
//             <span>{{ f.text }}</span>
//           </div>
//         </div>
//       </div>

//       <div class="login-right">
//         <div class="login-card">
//           <h2 class="login-title">Sign in to SafeWork</h2>
//           <p class="login-sub" style="color:red">Sign in with approved account credentials.</p>

//           <div *ngIf="error()" class="alert alert-danger" style="margin-bottom:16px">
//             <span>⚠</span> {{ error() }}
//           </div>

//           <form (ngSubmit)="submit()" #loginForm="ngForm">
//             <div class="form-group" style="margin-bottom:14px">
//               <label class="form-label">Email Address</label>
//               <input type="email" name="email" [(ngModel)]="email" required class="form-control" placeholder="your@email.com" autocomplete="username" />
//             </div>
//             <div class="form-group" style="margin-bottom:20px">
//               <label class="form-label">Password</label>
//               <input type="password" name="password" [(ngModel)]="password" required class="form-control" placeholder="••••••••" autocomplete="current-password" />
//             </div>
//             <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:11px" [disabled]="loading()">
//               {{ loading() ? 'Signing in...' : 'Sign In' }}
//             </button>
//           </form>

//           <div style="margin-top:12px;text-align:center">
//             <a routerLink="/employee-register" style="font-size:13px;color:var(--primary);text-decoration:none">New employee? Register here</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .login-page { display: flex; min-height: 100vh; }

//     .login-left { flex: 1; background: linear-gradient(145deg, #1a3c5e 0%, #0f2440 100%); color: #fff; padding: 48px; display: flex; flex-direction: column; justify-content: center; gap: 24px; }
//     .login-brand { display: flex; align-items: center; gap: 12px; }
//     .brand-logo { width: 44px; height: 44px; background: #fff; color: #1a3c5e; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; }
//     .brand-name { font-size: 20px; font-weight: 700; }
//     .login-headline { font-size: 2.25rem; font-weight: 700; line-height: 1.15; letter-spacing: -.02em; max-width: 400px; }
//     .login-desc { font-size: 15px; color: rgba(255,255,255,.75); max-width: 380px; line-height: 1.6; }
//     .feature-list { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
//     .feature-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: rgba(255,255,255,.85); }
//     .feature-icon { font-size: 18px; width: 28px; text-align: center; }

//     .login-right { width: 480px; background: var(--bg); display: flex; align-items: center; justify-content: center; padding: 32px 24px; }
//     .login-card { width: 100%; max-width: 400px; }
//     .login-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 6px; }
//     .login-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }

//     @media (max-width: 900px) {
//       .login-left { display: none; }
//       .login-right { width: 100%; }
//     }
//   `],
// })
// export class LoginComponent {
//   private auth = inject(AuthService);
//   private router = inject(Router);

//   email = '';
//   password = '';
//   error = signal('');
//   loading = signal(false);

//   features = [
//     { icon: '⚠', text: 'Hazard reporting & incident management' },
//     { icon: '🔍', text: 'Safety inspections & compliance tracking' },
//     { icon: '📋', text: 'Workplace safety program oversight' },
//     { icon: '📊', text: 'Compliance audits & analytics' },
//     { icon: '🔔', text: 'Real-time alerts & notifications' },
//   ];

//   async submit(): Promise<void> {
//     this.error.set('');
//     if (!this.email || !this.password) {
//       this.error.set('Please enter your email and password.');
//       return;
//     }
//     this.loading.set(true);
//     const result = await this.auth.login(this.email, this.password);
//     this.loading.set(false);
//     if (result.success) {
//       this.router.navigate(['/dashboard']);
//     } else {
//       this.error.set(result.message);
//     }
//   }
// }
