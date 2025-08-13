# 📋 Guía de Configuración: LinkedIn API para Intertrade Solutions

Esta guía te llevará paso a paso para configurar la integración con LinkedIn API y mostrar el último post de la empresa en el footer del sitio web.

## 🎯 **Paso 1: Crear LinkedIn Developer App**

### 1.1 Acceder al Portal de Desarrolladores
1. Ve a [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Inicia sesión con tu cuenta personal de Roberto Vargas
3. Haz clic en **"Create App"**

### 1.2 Configurar la Aplicación
Completa el formulario con esta información:

- **App name**: `Intertrade Solutions Website`
- **LinkedIn Page**: Buscar y seleccionar **"Intertrade Solutions"**
- **Privacy policy URL**: `https://tu-dominio.com/privacy` (crear si no existe)
- **App logo**: Subir el logo de Intertrade Solutions
- **Legal agreement**: Aceptar los términos

### 1.3 Configurar Productos (Products)
En la sección "Products", solicitar acceso a:
- ✅ **Community Management API** (para acceso a posts de organización)
- ✅ O cualquier producto que incluya el permiso `r_organization_social`

**Nota**: El "Marketing Developer Platform" ya no existe. LinkedIn ha actualizado su estructura de APIs en 2025.

## 🔑 **Paso 2: Obtener Credenciales**

### 2.1 Credenciales Básicas
En la pestaña **"Auth"** de tu app, encontrarás:
- `Client ID` - Copiar este valor
- `Client Secret` - Copiar este valor

### 2.2 Configurar OAuth 2.0
En **"OAuth 2.0 settings"**:
- **Authorized redirect URLs**: Agregar `https://tu-dominio.com/auth/linkedin/callback`
- Para desarrollo local: `http://localhost:4321/auth/linkedin/callback`

## 🏢 **Paso 3: Autorización de la Empresa**

### 3.1 Obtener ID de la Organización
1. Ve a la página de LinkedIn de Intertrade Solutions
2. En la URL, busca el número después de `/company/`
3. Ejemplo: `linkedin.com/company/12345` → El ID es `12345`

### 3.2 Solicitar Autorización
**IMPORTANTE**: Un administrador de la página de Intertrade Solutions debe:
1. Ir a la configuración de la página de empresa
2. En "Admin tools" → "Manage admins"
3. Autorizar tu aplicación para acceder a los posts

## 🔐 **Paso 4: Generar Access Token**

### 4.1 Flujo OAuth 2.0
Usar este endpoint para obtener el token:

```bash
# 1. Obtener código de autorización
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=r_organization_social

# 2. Intercambiar código por token
POST https://www.linkedin.com/oauth/v2/accessToken
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code={AUTHORIZATION_CODE}&redirect_uri={REDIRECT_URI}&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}
```

### 4.2 Permisos Requeridos
Asegúrate de solicitar estos scopes:
- `r_organization_social` - Para leer posts de la organización

## ⚙️ **Paso 5: Configurar Variables de Entorno**

### 5.1 Crear archivo .env
Copia `.env.example` a `.env` y completa:

```env
LINKEDIN_CLIENT_ID=tu_client_id_aqui
LINKEDIN_CLIENT_SECRET=tu_client_secret_aqui
LINKEDIN_ACCESS_TOKEN=tu_access_token_aqui
LINKEDIN_ORG_ID=12345
SITE_URL=https://tu-dominio.com
```

### 5.2 Verificar Configuración
Ejecuta este comando para probar la conexión:

```bash
curl -X GET "http://localhost:4321/api/linkedin/latest-post" \
  -H "Content-Type: application/json"
```

## 🧪 **Paso 6: Probar la Integración**

### 6.1 Desarrollo Local
```bash
npm run dev
```

### 6.2 Verificar en el Footer
1. Ve al footer del sitio
2. Busca la sección "Últimas Noticias"
3. Debería mostrar:
   - ✅ Título del último post
   - ✅ Extracto del contenido
   - ✅ Imagen (si el post tiene una)
   - ✅ Fecha de publicación
   - ✅ Enlace al post original
   - ✅ Indicador "En vivo desde LinkedIn"

## 🚨 **Solución de Problemas**

### Error: "LinkedIn API not available"
- ✅ Verificar que las variables de entorno estén configuradas
- ✅ Confirmar que el access token no haya expirado
- ✅ Revisar que la app tenga los permisos correctos

### Error: "No posts found"
- ✅ Verificar que el ID de organización sea correcto
- ✅ Confirmar que la página tenga posts públicos
- ✅ Revisar que el token tenga permisos de lectura

### Error: "Authorization failed"
- ✅ Un admin de la página debe autorizar la app
- ✅ Verificar que la app esté asociada con la página correcta
- ✅ Confirmar que el scope incluya `r_organization_social`

## 📊 **Limitaciones y Consideraciones**

### Rate Limits
- LinkedIn permite un número limitado de requests por día
- El componente tiene cache de 5 minutos para optimizar

### Renovación de Tokens
- Los access tokens expiran (generalmente en 60 días)
- Implementar renovación automática en producción

### Fallback
- Si la API no está disponible, se muestra contenido de respaldo
- El sitio sigue funcionando sin interrupciones

## ✅ **Checklist Final**

- [ ] App creada en LinkedIn Developer Portal
- [ ] Permisos `r_organization_social` aprobados
- [ ] Admin de Intertrade autorizó la app
- [ ] Variables de entorno configuradas
- [ ] Access token generado y válido
- [ ] ID de organización correcto
- [ ] Prueba local exitosa
- [ ] Footer muestra el post real
- [ ] Enlace redirige al post original

---

## 🆘 **¿Necesitas Ayuda?**

Si encuentras problemas durante la configuración:

1. **Revisa los logs** del servidor para errores específicos
2. **Verifica las credenciales** en el Developer Portal
3. **Confirma los permisos** con el admin de la página
4. **Prueba el endpoint** directamente con curl/Postman

¡Una vez completados todos los pasos, el footer mostrará automáticamente el último post de Intertrade Solutions en LinkedIn! 🚀
