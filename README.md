# Pymecrypto Governance Token (PYMToken)

## Descripción del Proyecto

Pymecrypto es un protocolo descentralizado que permite a los participantes tomar decisiones sobre la gestión de recursos y propuestas de desarrollo a través de un token de gobernanza llamado **PYMToken**. Este proyecto fue creado para impulsar la participación de la comunidad y fomentar la descentralización en la toma de decisiones.

El token PYM se utiliza para la votación de propuestas, la delegación de poder de voto y la distribución de recompensas en el ecosistema de Pymecrypto. El contrato inteligente de PYMToken está basado en el estándar ERC20 y utiliza funcionalidades adicionales de la biblioteca OpenZeppelin para permitir una estructura de gobernanza sólida y eficiente.

---

## Funcionalidades del Contrato

### 1. Suministro Inicial
- **Total Suministro**: 100,000,000 PYM.
- **Distribución del Suministro**:
  - **50%** - Comunidad y recompensas.
  - **30%** - Tesorería y reservas del contrato.
  - **20%** - Asignación para el equipo fundador.

### 2. Gobernanza y Propuestas
- **Creación de propuestas**: Cualquier usuario con al menos 1,000 PYM puede crear una propuesta de gobernanza.
- **Votación en propuestas**: Los usuarios pueden votar a favor o en contra de las propuestas. Cada voto se pondera por la cantidad de PYM que el usuario poseía en el momento del bloque de creación de la propuesta.
- **Ejecución de propuestas**: Las propuestas aprobadas pueden ejecutarse tras un periodo de votación de 7 días.

### 3. Delegación de Votos
- **Delegación de poder de voto**: Los usuarios pueden delegar su poder de voto a otra dirección.

### 4. Recompensas y Distribución
- **Distribución de recompensas**: El propietario del contrato puede distribuir recompensas a múltiples usuarios utilizando tokens almacenados en el contrato.

### 5. Seguridad y Permisos
- **Restricciones de propietario**: Funciones críticas, como la distribución de recompensas y la ejecución de propuestas, solo están permitidas para el propietario del contrato.
- **Protección contra votaciones futuras**: El contrato no permite obtener poder de voto de bloques futuros para garantizar la integridad del sistema de gobernanza.

---

## Ejecución de Pruebas

El proyecto incluye un conjunto completo de pruebas en TypeScript para verificar la funcionalidad de cada componente principal del contrato. Para ejecutar las pruebas, sigue estos pasos:

```bash
npx hardhat test
```

## Ejecución de Pruebas

Las pruebas verifican:

- La correcta asignación del suministro inicial.
- La capacidad de los usuarios para crear y votar en propuestas.
- Las restricciones de gobernanza, como la prevención de votos duplicados y la restricción de creación de propuestas a usuarios con suficiente poder de voto.
- La funcionalidad de delegación y distribución de recompensas.

---

## Modelo de Negocio

### 1. Gobernanza Descentralizada
El modelo de negocio de Pymecrypto se basa en la descentralización de la toma de decisiones a través de la participación activa de los usuarios. Al poseer tokens PYM, los usuarios pueden votar y participar en decisiones clave, dándoles un sentido de propiedad y alineando los intereses de la comunidad con los del proyecto.

### 2. Incentivos y Recompensas
Para fomentar la participación, Pymecrypto reserva una parte significativa de tokens para recompensas de la comunidad. Los usuarios que contribuyan al ecosistema, ya sea participando en votaciones o mediante otras actividades, pueden recibir tokens de la reserva de recompensas.

### 3. Transparencia en la Tesorería
Los tokens en la tesorería están controlados por la comunidad, y su uso solo se puede autorizar a través de la gobernanza descentralizada. Esto da confianza a los usuarios sobre la gestión de los recursos, ya que todas las decisiones de gasto son públicas y decididas por votación.

### 4. Delegación de Poder
La funcionalidad de delegación permite que incluso aquellos con pocos tokens puedan ser representados en votaciones importantes. Esto promueve la equidad y asegura que las decisiones se tomen con una representación justa de la comunidad.

---

## Instalación, compilación, despliegue y Uso

```bash
npm install
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost #actualiza el address del contrato desplegado en local en scripts/interact.ts
npx hardhat run scripts/interact.ts --network localhost
```


